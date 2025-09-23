from flask import Blueprint, request, jsonify
from service.conversation import createConversation,getConversation
con_bp = Blueprint('conversation', __name__)
@con_bp.route("/conversation", methods=["POST"])
def create_conversation():
    data = request.get_json()
    if not data:
        return jsonify({
            "success": False,
            "error": "No data provided"
        }), 400
    try:
        userId = data['userId']
        interviewId = data['interviewId']
        conversations = data['conversations']
        response = createConversation(conversations, userId, interviewId)
        return jsonify({
            "success": True,
            "data": response
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Could not create conversation",
            "details": str(e)
        }), 500
@con_bp.route("/conversation", methods=["GET"])
def get_conversation():
    userId = request.args.get('userId')
    interviewId = request.args.get('interviewId')
    if not userId or not interviewId:
        return jsonify({
            "success": False,
            "error": "userId and interviewId are required"
        }), 400
    try:
        response = getConversation(userId, interviewId)
        return jsonify({
            "success": True,
            "data": response
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Could not fetch conversation",
            "details": str(e)
        }), 500