from datetime import timedelta
from uuid import UUID
from flask import Flask, jsonify, request
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt_identity,
    jwt_required,
)
from flask_cors import CORS
from flask_limiter import Limiter, RateLimitExceeded
from flask_limiter.util import get_remote_address
import os

from database import db, db_add_user, Status, db_get_watchlist, db_login, db_add_to_watchlist, db_remove_from_watchlist
import tmdb_api as tmdb

app = Flask(__name__)

app.config.update(
    JWT_SECRET_KEY=os.environ.get("JWT_SECRET", "change-me"),
    JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=10),
    JWT_TOKEN_LOCATION=["headers"],
    SQLALCHEMY_DATABASE_URI="sqlite:///movies.db",
)

db.init_app(app)

jwt = JWTManager(app)

CORS(app, origins=["http://127.0.0.1:5173"])

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["100 per minute"],
)

with app.app_context():
    db.create_all()


@app.errorhandler(RateLimitExceeded)
def ratelimit_handler(e):
    return jsonify({"msg": str(e)}), 429

@app.shell_context_processor
def make_shell_context():
    return {"db": db, "db_add_to_watchlist": db_add_to_watchlist, "db_get_watchlist": db_get_watchlist}


@app.route("/api/login", methods=["POST"])
@limiter.limit("10 per minute")
def login_user():
    email = request.form["email"]
    password = request.form["password"]

    status = db_login(email, password)

    if status == Status.UNAUTHORISED:
        return jsonify({"msg": "Bad credentials"}), 401

    token = create_access_token(identity=email)

    return (
        jsonify(
            {
                "access_token": token,
            }
        ),
        200,
    )


@app.route("/api/logout", methods=["POST"])
@limiter.limit("10 per minute")
def logout_user():
    return (
        jsonify(
            {
                "msg": "logout successful",
            }
        ),
        200,
    )


@app.route("/api/users/create", methods=["POST"])
@limiter.limit("10 per minute")
def user_create():
    username = request.form["username"]
    email = request.form["email"]
    password = request.form["password"]

    status = db_add_user(username, email, password)

    if status == Status.CONFLICT:
        return (
            jsonify(
                {
                    "msg": "username or email taken",
                }
            ),
            409,
        )

    token = create_access_token(identity=email)

    return (
        jsonify(
            {
                "access_token": token,
            }
        ),
        201,
    )


@app.route("/api/movie/search", methods=["GET"])
@limiter.limit("60 per minute")
@jwt_required()
def movie_search():
    query = request.args.get("q")

    if query is None:
        return (
            jsonify(
                {
                    "msg": "Missing term to search for.",
                }
            ),
            400,
        )

    results = tmdb.search(query)

    return jsonify(results), 200


@app.route("/api/movie/<id_str>")
@limiter.limit("10 per minute")
@jwt_required()
def movie_info(id_str):
    try:
        movie_id = int(id_str)
    except ValueError:
        return (
            jsonify(
                {
                    "msg": "could not parse id as an integer",
                }
            ),
            400,
        )

    results = tmdb.get_movie_details(movie_id)

    return jsonify(results), 200


@app.get("/api/watchlist")
@limiter.limit("10 per minute")
@jwt_required()
def get_watchlist():
    email = get_jwt_identity()
    watchlist = db_get_watchlist(email)
    return jsonify(watchlist)

@app.post("/api/watchlist/<movie_id_str>")
@limiter.limit("10 per minute")
@jwt_required()
def post_watchlist_item(movie_id_str: str):
    try:
        movie_id: int = int(movie_id_str)
        status, value = db_add_to_watchlist(email=get_jwt_identity(), id=movie_id)
        if status == Status.SUCCESS:
            return jsonify(value)
        elif status == Status.CONFLICT:
            return jsonify({
                "msg": "movie is already in watchlist"
                })

    except ValueError:
        return (
                jsonify(
                    {
                        "msg": "could not parse id as integer"
                        }
                    ),400
                )

@app.delete("/api/watchlist/<watchlist_id>")
@limiter.limit("10 per minute")
@jwt_required()
def delete_watchlist_item(watchlist_id: str):
    try:
        watchlist_uuid = UUID(watchlist_id)
        status = db_remove_from_watchlist(email=get_jwt_identity(), id=watchlist_uuid)
        return str(status)
    except ValueError:
        return (
                jsonify(
                    {"msg": "could not parse id as uuid"}
                    ),400
                )

