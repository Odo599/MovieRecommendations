from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET", "change-me")

jwt = JWTManager(app)

CORS(app, origins=["*"], supports_credentials=True)

limiter = Limiter(get_remote_address, app=app, default_limits=["100 per minute"])

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if username == "test" and password == "test":
        token = create_access_token(identity=username)
        return jsonify(access_token=token)

    return jsonify({"msg": "Bad credentials"}), 401

@app.route("/api/search")
@jwt_required()
@limiter.limit("20 per minute")
def search_movies():
    query = request.args.get("q")

    if not query:
        return jsonify({"error": "Missing query"}), 400

    return jsonify("Test response")

