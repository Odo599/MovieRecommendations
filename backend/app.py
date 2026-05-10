from datetime import datetime, timedelta, timezone
from flask import Flask, jsonify, request
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    unset_jwt_cookies,
)
from flask_cors import CORS
from flask_limiter import Limiter, RateLimitExceeded
from flask_limiter.util import get_remote_address
import os

from database import db, add_user, AddUserReturnStatus, login, LoginStatus
import tmdb_api as tmdb

app = Flask(__name__)

app.config.update(
    JWT_SECRET_KEY=os.environ.get("JWT_SECRET", "change-me"),
    JWT_COOKIE_SECURE=False,
    JWT_COOKIE_SAMESITE="Lax",
    JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=10),
    JWT_TOKEN_LOCATION=["cookies"],
    SQLALCHEMY_DATABASE_URI="sqlite:///movies.db",
)

db.init_app(app)

jwt = JWTManager(app)

CORS(app, origins=["http://127.0.0.1:5173"], supports_credentials=True)

limiter = Limiter(get_remote_address, app=app, default_limits=["100 per minute"])

with app.app_context():
    db.create_all()


@app.errorhandler(RateLimitExceeded)
def ratelimit_handler(e):
    return jsonify({"msg": str(e)}), 429


@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        return response


@app.route("/api/login", methods=["POST"])
@limiter.limit("10 per minute")
def login_user():
    email = request.form["email"]
    password = request.form["password"]

    status = login(email, password)

    if status == LoginStatus.UNAUTHORISED:
        return jsonify({"msg": "Bad credentials"}), 401

    token = create_access_token(identity=email)
    response = jsonify(access_token=token)
    set_access_cookies(response, token)
    return response


@app.route("/api/logout", methods=["POST"])
@limiter.limit("10 per minute")
# @jwt_required()
def logout_user():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response, 200


@app.route("/api/users/create", methods=["POST"])
@limiter.limit("10 per minute")
def user_create():
    username = request.form["username"]
    email = request.form["email"]
    password = request.form["password"]
    status = add_user(username, email, password)

    if status == AddUserReturnStatus.CONFLICT:
        return jsonify({"msg": "username or email taken"}), 409

    token = create_access_token(identity=email)
    response = jsonify(access_token=token)
    set_access_cookies(response, token)
    return response, 204


@app.route("/api/movie/search", methods=["GET"])
@limiter.limit("60 per minute")
@jwt_required()
def movie_search():
    query = request.args["q"]
    query = request.args.get("q")
    if query == None:
        return jsonify({"msg": "Missing term to search for."}), 400

    results = tmdb.search(query)

    return jsonify(results), 200


@app.route("/api/movie/<id_str>/similar")
@limiter.limit("10 per minute")
@jwt_required()
def movie_similar(id_str):
    try:
        movie_id = int(id_str)
        results = tmdb.get_similar_movies(movie_id)
        return jsonify(results), 200
    except:
        return jsonify({"msg": "could not parse id as an integer."}), 400


@app.route("/api/movie/<id_str>")
@limiter.limit("10 per minute")
@jwt_required()
def movie_info(id_str):
    try:
        movie_id = int(id_str)
        results = tmdb.get_movie_details(movie_id)
        return jsonify(results), 200
    except:
        return jsonify({"msg": "could not parse id as an integer"}), 400
