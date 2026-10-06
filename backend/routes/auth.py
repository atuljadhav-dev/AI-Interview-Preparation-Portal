from flask import Blueprint, request, jsonify, make_response, g
from pydantic import ValidationError
from models.user import User
from service.user import createUser, FindUserByEmail, SignIn, FindUserById
from utils.limiter import limiter
from utils.jwt import createJWT,verifyJWT
auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST"])
@limiter.limit("10 per minute")  # Limit signup attempts
def signup():
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "No data provided"}), 400

    try:
        userData = User(**data)  # Validate input data
    except ValidationError as e:
        error = e.errors()[0]["msg"]  # Get the first validation error message
        return jsonify({"success": False, "error": error}), 422

    check = FindUserByEmail(data["email"])  # Check if user already exists
    if check:
        return jsonify({"success": False, "error": "User Already exists"}), 403

    try:
        user = createUser(data["name"], data["email"], data["password"])
        user["_id"] = str(user["_id"])  # Convert ObjectId to string
        user.pop("password", None)  # Remove password from response
    except Exception as e:
        print(f"Error creating user: {e}")
        return jsonify({"success": False, "error": "Could not create user"}), 500

    token = createJWT(user["_id"])  # Create JWT token

    response = make_response(
        jsonify(
            {
                "success": True,
                "message": "User created successfully!",
                "token": token,
                "data": user,
            }
        ),
        201,
    )  # Set cookie with token

    response.set_cookie(
        "authToken",
        token,
        httponly=True,  # Prevent access via JavaScript
        samesite="None",  # Allow cross-site requests
        secure=True,  # Only send over HTTPS
        max_age=2 * 24 * 60 * 60,  # 2 days
    )
    return response


@auth_bp.route("/signin", methods=["POST"])
@limiter.limit("10 per minute")  # Limit SignIn attempts
def signin():
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "No data provided"}), 400
    if "email" not in data or "password" not in data:
        return jsonify({"success": False, "error": "Email and password are required"}), 400
    user = SignIn(data["email"], data["password"])
    if not user:
        return jsonify({"success": False, "error": "Wrong Credentials"}), 403

    user["_id"] = str(user["_id"])
    user.pop("password", None)

    token = createJWT(user["_id"])

    response = make_response(
        jsonify(
            {
                "success": True,
                "message": "User signed in successfully!",
                "token": token,
                "data": user,
            }
        ),
        200,
    )

    response.set_cookie(
        "authToken",
        token,
        httponly=True,
        samesite="None",
        secure=True,
        max_age=2 * 24 * 60 * 60,
    )
    return response


@auth_bp.route("/signout", methods=["POST"])
@limiter.limit("10 per minute")  # Limit signout attempts
def signout():
    response = make_response(
        jsonify({"success": True, "message": "User signed out successfully!"}), 200
    )
    response.set_cookie(
        "authToken", "", expires=0, httponly=True, samesite="None", secure=True
    )
    return response


@auth_bp.route("/verify", methods=["GET"])
@limiter.limit("10 per minute")  # Limit verification attempts
def verify():
    """Verify the user's authentication status using the JWT token."""
    userId = g.userId
    user = FindUserById(userId)
    if not user:
        response = make_response(
            jsonify({"success": False, "message": "Unauthorized"}), 403
        )
        response.set_cookie(
            "authToken", "", expires=0, httponly=True, samesite="None", secure=True
        )
        return response

    user["_id"] = str(user["_id"])
    user.pop("password", None)

    return (
        jsonify(
            {"success": True, "message": "User verified successfully!", "data": user}
        ),
        200,
    )
