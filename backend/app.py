from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os

from database import db, add_user, AddUserReturnStatus, login, LoginStatus
import tmdb_api as tmdb

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET", "change-me")
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///movies.db"

db.init_app(app)

jwt = JWTManager(app)

CORS(app, origins=["*"], supports_credentials=True)

limiter = Limiter(get_remote_address, app=app, default_limits=["100 per minute"])

with app.app_context():
    db.create_all()


@app.route("/login", methods=["POST"])
@limiter.limit("10 per minute")
def login_user():
    email = request.form["email"]
    password = request.form["password"]

    status = login(email, password)

    if status == LoginStatus.UNAUTHORISED:
        return jsonify({"msg": "Bad credentials"}), 401

    token = create_access_token(identity=email)
    return jsonify(access_token=token)


@app.route("/users/create", methods=["POST"])
@limiter.limit("10 per minute")
def user_create():
    status = add_user(
        request.form["username"], request.form["email"], request.form["password"]
    )

    if status == AddUserReturnStatus.CONFLICT:
        return jsonify({"msg": "username or email taken"}), 409
    return "", 204


@app.route("/movie/search", methods=["GET"])
@limiter.limit("60 per minute")
@jwt_required()
def movie_search():
    query = request.args["q"]
    query = request.args.get("q")
    if query == None:
        return jsonify({"msg": "Missing term to search for."}), 400

    results = tmdb.search(query)

    return jsonify(results), 200


@app.route("/movie/<id_str>/similar")
@limiter.limit("10 per minute")
@jwt_required()
def movie_similar(id_str):
    try:
        movie_id = int(id_str)
        results = tmdb.get_similar_movies(movie_id)
        return jsonify(results), 200
    except:
        return jsonify({"msg": "could not parse id as an integer."}), 400


@app.route("/movie/<id_str>")
@limiter.limit("10 per minute")
@jwt_required()
def movie_info(id_str):
    try:
        movie_id = int(id_str)
        results = tmdb.get_movie_details(movie_id)
        return jsonify(results), 200
    except:
        return jsonify({"msg": "could not parse id as an integer"}), 400
