from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import or_
from flask_sqlalchemy import SQLAlchemy
from enum import Enum
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
import time


# setup db
class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(unique=True)
    email: Mapped[str] = mapped_column(unique=True)
    phash: Mapped[str] = mapped_column(unique=True)

    def __init__(self, username: str, email: str, phash: str) -> None:
        self.username = username
        self.email = email
        self.phash = phash


# setup password hasher
ph = PasswordHasher()


def check_hash(hash: str, password: str):
    try:
        ph.verify(hash, password)
        return True
    except VerifyMismatchError:
        return False


# functions and enums
class AddUserReturnStatus(Enum):
    SUCCESS = 204
    CONFLICT = 409


def add_user(username: str, email: str, password: str):
    existing = db.session.execute(
        db.select(User).where(or_(User.username == username, User.email == email))
    ).scalar_one_or_none()

    if existing != None:
        return AddUserReturnStatus.CONFLICT

    phash = ph.hash(password)

    user = User(username=username, email=email, phash=phash)
    db.session.add(user)
    db.session.commit()


class LoginStatus(Enum):
    SUCCESS = 200
    UNAUTHORISED = 401


def login(email: str, password: str):
    existing = db.session.execute(
        db.select(User).where(User.email == email)
    ).scalar_one_or_none()

    if existing == None:
        time.sleep(50 / 1000)
        return LoginStatus.UNAUTHORISED

    phash = existing.phash
    success = check_hash(phash, password)
    if success:
        return LoginStatus.SUCCESS
    return LoginStatus.UNAUTHORISED
