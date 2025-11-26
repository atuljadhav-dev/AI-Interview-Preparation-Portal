from flask import Blueprint, request, jsonify
from service.conversation import createConversation,getConversation
from routes.auth import verify_jwt  # <-- Import here

con_bp = Blueprint('conversation', __name__)

@con_bp.route("/conversation", methods=["POST"])
def create_conversation():
    token_user = verify_jwt(request)
    if not token_user:
        return jsonify({
            "success": False, 
            "error": "Unauthorized"
            }), 401

    data = request.get_json()
    if not data:
        return jsonify({
            "success": False,
            "error": "No data provided"
        }), 400
    try:
        interviewId = data['interviewId']
        conversations = data['conversations']
        if not all([interviewId, conversations]):
            return jsonify({
                "success": False,
                "error": "Invalid input data"
            }), 400
        response = createConversation(conversations, userId=token_user, interviewId=interviewId)
        return jsonify({
            "success": True,
            "message": "Conversation created successfully",
            "data": response
        }), 201
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Server error: Could not create conversation",
        }), 500
@con_bp.route("/conversation", methods=["GET"])
def get_conversation():
    token_user = verify_jwt(request)
    if not token_user:
        return jsonify({
            "success": False, 
            "error": "Unauthorized"
            }), 401
    
    interviewId = request.args.get('interviewId')
    if  not interviewId:
        return jsonify({
            "success": False,
            "error": "interviewId are required"
        }), 400
    
    try:
        response = getConversation(userId=token_user, interviewId=interviewId)
        return jsonify({
            "success": True,
            "message": "Conversation fetched successfully",
            "data": response
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Server error: Could not fetch conversation",
        }), 500