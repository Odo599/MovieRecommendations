from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os

from database import db, add_user, AddUserReturnStatus, login, LoginStatus

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
