from flask import Blueprint, jsonify, request
import requests
import os
from dotenv import load_dotenv
from utils.limiter import limiter
from routes.auth import verifyJWT


load_dotenv()
API_KEY = os.getenv("RAPIDAPI_KEY")
code_bp = Blueprint("code", __name__)


@code_bp.route("/execute", methods=["POST"])
@limiter.limit("100 per minute")  # Limit to 10 requests per minute
def executeCode():
    userId = verifyJWT(request)
    if not userId:
        return jsonify({"success": False, "error": "Unauthorized"}), 401
    data = request.get_json()
    if not data or "code" not in data or "language" not in data:
        return jsonify({"success": False, "error": "No code provided"}), 400
    LANGUAGES = {
        "python": "main.py",
        "javascript": "index.js",
        "java": "main.java",
        "c++": "main.cpp",
        "c": "main.c",
        "ruby": "main.rb",
        "go": "main.go",
        "php": "main.php",
    }
    try:
        response = requests.post(
            "https://onecompiler-apis.p.rapidapi.com/api/v1/run",
            headers={
                "x-rapidapi-key": API_KEY,
                "x-rapidapi-host": "onecompiler-apis.p.rapidapi.com",
                "Content-Type": "application/json",
            },
            json={
                "language": data["language"],
                "stdin": data.get("stdin", ""),
                "files": [
                    {
                        "name": LANGUAGES.get(data["language"], "index.js"),
                        "content": data["code"],
                    }
                ],
            },
        )
        return (
            jsonify(
                {
                    "data": response.json(),
                    "success": True,
                    "message": "Code executed successfully",
                }
            ),
            200,
        )
    except Exception as e:
        print(f"Error executing code: {e}")
        return (
            jsonify(
                {
                    "error": "An error occurred while executing the code.",
                    "success": False,
                }
            ),
            500,
        )
