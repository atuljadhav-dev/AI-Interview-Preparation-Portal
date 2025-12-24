from flask import Blueprint, request, jsonify, make_response
from pydantic import ValidationError
from models.user import User
from service.user import createUser, FindUserByEmail, Login, FindUserById
import jwt, datetime, os
from utils.limiter import limiter
auth_bp = Blueprint('auth', __name__)

SECRET_KEY = os.getenv("JWT_SECRET")  

def create_jwt(userId):
    '''Create a JWT token for the given user ID with a 2-day expiry.'''
    payload = {
        "userId": str(userId),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=2)  
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def verify_jwt(request):
    '''Verify the JWT token from the request cookies and return the user ID if valid.'''
    token = request.cookies.get("authToken")
    if not token:
        return None 
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded["userId"]
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

@auth_bp.route("/signup", methods=["POST"])
@limiter.limit("5 per minute") # Limit signup attempts
def signup():
    data = request.get_json()
    if not data:
        return jsonify({
            "success": False, 
            "error": "No data provided"
            }), 400
    
    try:
        userData = User(**data)# Validate input data
    except ValidationError as e:
        error = e.errors()[0]["msg"]# Get the first validation error message
        return jsonify({
            "success": False, 
            "error": error
            }), 422
    
    check = FindUserByEmail(data['email'])# Check if user already exists
    if check:
        return jsonify({
            "success": False, 
            "error": "User Already exists"
            }), 403
    
    try:
        user = createUser(data['name'], data['email'], data['password'], data['phone'])
        user["_id"] = str(user["_id"])# Convert ObjectId to string
        user.pop("password", None)# Remove password from response
    except Exception as e:
        return jsonify({
            "success": False, 
            "error": "Could not create user"
            }), 500
    
    token = create_jwt(user["_id"])# Create JWT token

    response = make_response(jsonify({
        "success": True,
        "message": "User created successfully!",
        "token": token,
        "data": user
    }), 201)# Set cookie with token

    response.set_cookie(
        "authToken",
        token,
        httponly=True,
        samesite="None",
        secure=True,
        max_age=2*24*60*60  #2 days
    )
    return response

@auth_bp.route("/signin", methods=["POST"])
@limiter.limit("10 per minute") # Limit login attempts
def signin():
    data = request.get_json()
    if not data:
        return jsonify({
            "success": False, 
            "error": "No data provided"
            }), 400
    
    user = Login(data['email'], data['password'])
    if not user:
        return jsonify({
            "success": False, 
            "error": "Wrong Credentials"
            }), 403
    
    user["_id"] = str(user["_id"])
    user.pop("password", None)

    token = create_jwt(user["_id"])

    response = make_response(jsonify({
        "success": True,
        "message": "User signed in successfully!",
        "token": token,
        "data": user
    }), 200)

    response.set_cookie(
        "authToken",
        token,
        httponly=True,
        samesite="None",
        secure=True,
        max_age=2*24*60*60 
    )
    return response

@auth_bp.route("/signout", methods=["POST"])
@limiter.limit("10 per minute") # Limit signout attempts
def signout():
    response = make_response(jsonify({
        "success": True,
        "message": "User signed out successfully!"
    }), 200)
    response.set_cookie("authToken", "", expires=0, httponly=True, samesite="None", secure=True)
    return response

@auth_bp.route("/verify", methods=["GET"])
@limiter.limit("15 per minute") # Limit verification attempts
def verify():
    '''Verify the user's authentication status using the JWT token.'''
    authToken = request.cookies.get("authToken")
    if not authToken:
        return jsonify({
            "success": False, 
            "error": "Unauthorized"
            }), 403
    decoded = verify_jwt(request)
    if not decoded:
        return jsonify({
            "success": False, 
            "error": "Unauthorized"
            }), 403

    user = FindUserById(decoded)
    if not user:
        return jsonify({
            "success": False, 
            "error": "Unauthorized"
            }), 403

    user["_id"] = str(user["_id"])
    user.pop("password", None)

    return jsonify({
        "success": True,
        "message": "User verified successfully!",
        "data": user
    }), 200
