import os, jwt, datetime
from flask import request, jsonify, g
SECRET_KEY = os.getenv("JWT_SECRET")
if not SECRET_KEY:
    raise ValueError("Secret is Missing!")


def createJWT(userId):
    """Create a JWT token for the given user ID with a 2-day expiry."""
    payload = {
        "userId": str(userId),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=2),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def verifyJWT():
    """Reusable hook function for blueprints."""
    if request.blueprint == 'auth' and request.endpoint != 'auth.verify':
        return None 
    token = request.cookies.get("authToken")
    if not token:
        return jsonify({"error": "Authentication token missing"}), 401
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        g.userId = decoded["userId"]
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401