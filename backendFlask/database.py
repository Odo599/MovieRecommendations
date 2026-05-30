from typing import List, Literal, TypedDict
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import ForeignKey, ScalarResult, or_
from flask_sqlalchemy import SQLAlchemy
from enum import Enum
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
import time
import uuid
import tmdb_api


class PublicWatchlistItem(TypedDict):
    id: uuid.UUID
    movie_id: int


# setup db
class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)


class Status(Enum):
    SUCCESS = 204
    SUCCESS_NO_RESPONSE = 204
    UNAUTHORISED = 401
    NOT_FOUND = 404
    CONFLICT = 409


class User(db.Model):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(unique=True)
    email: Mapped[str] = mapped_column(unique=True)
    phash: Mapped[str] = mapped_column(unique=True)
    country_code: Mapped[str] = mapped_column()

    def __init__(
        self, username: str, email: str, phash: str, country_code: str
    ) -> None:
        super().__init__()
        self.username = username
        self.email = email
        self.phash = phash
        self.country_code = country_code


class WatchlistItem(db.Model):
    __tablename__ = "watchlist"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    movie_id: Mapped[int] = mapped_column()
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    def __init__(self, movie_id: int, user_id: int) -> None:
        super().__init__()
        self.movie_id = movie_id
        self.user_id = user_id

    def to_public_dict(self) -> PublicWatchlistItem:
        return {
            "id": self.id,
            "movie_id": self.movie_id,
        }


# setup password hasher
ph = PasswordHasher()


def check_hash(hash: str, password: str):
    try:
        ph.verify(hash, password)
        return True
    except VerifyMismatchError:
        return False


# functions
def db_add_user(username: str, email: str, password: str, country_code: str):
    existing = db.session.execute(
        db.select(User).where(or_(User.username == username, User.email == email))
    ).scalar_one_or_none()

    if existing != None:
        return Status.CONFLICT

    phash = ph.hash(password)

    user = User(username=username, email=email, phash=phash, country_code=country_code)
    db.session.add(user)
    db.session.commit()


def db_login(email: str, password: str):
    existing = db.session.execute(
        db.select(User).where(User.email == email)
    ).scalar_one_or_none()

    if existing == None:
        time.sleep(50 / 1000)
        return Status.UNAUTHORISED

    phash = existing.phash
    success = check_hash(phash, password)
    if success:
        return Status.SUCCESS
    return Status.UNAUTHORISED


def db_get_search(query: str, email: str):
    results = tmdb_api.search(query)
    watchlist = db_get_raw_watchlist(email)
    added_data = []
    for movie in results.results:
        in_watchlist = False
        watchlist_id: uuid.UUID | None = None
        for watchlist_item in watchlist:
            if movie.id == watchlist_item.movie_id:
                in_watchlist = True
                watchlist_id = watchlist_item.id
        added_data.append(
            {
                **movie.model_dump(),
                "in_watchlist": in_watchlist,
                "watchlist_id": watchlist_id,
            }
        )

    return added_data


def db_get_raw_watchlist(email: str) -> list[WatchlistItem]:
    user: User | None = db.session.execute(
        db.select(User).where(User.email == email)
    ).scalar_one_or_none()

    if user is None:
        return []

    return list(
        db.session.scalars(
            db.select(WatchlistItem).where(WatchlistItem.user_id == user.id)
        ).all()
    )


def db_get_watchlist(
    email: str,
) -> List[PublicWatchlistItem] | Literal[Status.UNAUTHORISED]:
    watchlist_items = [movie.to_public_dict() for movie in db_get_raw_watchlist(email)]
    user: User | None = db.session.execute(
        db.select(User).where(User.email == email)
    ).scalar_one_or_none()
    if user == None:
        return Status.UNAUTHORISED

    return_items = []

    for watchlist_item in watchlist_items:
        details = tmdb_api.get_movie_details(watchlist_item["movie_id"]).model_dump()
        watch_providers = [
            x.model_dump()
            for x in tmdb_api.get_movie_watch_providers(
                watchlist_item["movie_id"], user.country_code
            )
        ]
        return_items.append(
            {
                **watchlist_item,
                "details": details,
                "watch_providers": watch_providers,
            }
        )

    return return_items


def db_add_to_watchlist(
    email: str, id: int
) -> (
    tuple[Literal[Status.SUCCESS], PublicWatchlistItem]
    | tuple[Literal[Status.CONFLICT] | Literal[Status.UNAUTHORISED], None]
):
    user: User | None = db.session.execute(
        db.select(User).where(User.email == email)
    ).scalar_one_or_none()
    if user is None:
        return Status.UNAUTHORISED, None

    existing_result: ScalarResult[WatchlistItem] = db.session.scalars(
        db.select(WatchlistItem)
        .where(WatchlistItem.user_id == user.id)
        .where(WatchlistItem.movie_id == id)
    )

    existing: list[WatchlistItem] = list(existing_result.all())

    if len(existing) > 0:
        return Status.CONFLICT, None

    item = WatchlistItem(movie_id=id, user_id=user.id)
    db.session.add(item)
    db.session.commit()
    db.session.refresh(item)
    return Status.SUCCESS, item.to_public_dict()


def db_remove_from_watchlist(email: str, id: uuid.UUID):
    user: User | None = db.session.execute(
        db.select(User).where(User.email == email)
    ).scalar_one_or_none()
    if user is None:
        return Status.UNAUTHORISED

    current_item: WatchlistItem | None = db.session.execute(
        db.select(WatchlistItem)
        .where(WatchlistItem.user_id == user.id)
        .where(WatchlistItem.id == id)
    ).scalar_one_or_none()

    if not current_item:
        return Status.NOT_FOUND

    db.session.delete(current_item)
    db.session.commit()

    return Status.SUCCESS_NO_RESPONSE
