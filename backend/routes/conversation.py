from flask import Blueprint, request, jsonify,g
from service.conversation import createConversation, getConversation
from utils.limiter import limiter

con_bp = Blueprint("conversation", __name__)


@con_bp.route("/conversation", methods=["POST"])
@limiter.limit("10 per minute")  # Limit to 10 requests per minute
def createConversationRoute():
    userId = g.userId

    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "No data provided"}), 400
    try:
        interviewId = data["interviewId"]
        conversations = data["conversations"]
        if not all([interviewId, conversations]):
            return jsonify({"success": False, "error": "Invalid input data"}), 400
        response = createConversation(
            conversations, userId=userId, interviewId=interviewId
        )
        return (
            jsonify(
                {
                    "success": True,
                    "message": "Conversation created successfully",
                    "data": response,
                }
            ),
            201,
        )
    except Exception as e:
        print(f"Error creating conversation: {e}")
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Server error: Could not create conversation",
                }
            ),
            500,
        )


@con_bp.route("/conversation", methods=["GET"])
@limiter.limit("10 per minute")  # Limit to 10 requests per minute
def getConversationRoute():
    userId = g.userId
    interviewId = request.args.get("interviewId")
    if not interviewId:
        return jsonify({"success": False, "error": "interviewId are required"}), 400
    try:
        response = getConversation(userId=userId, interviewId=interviewId)
        return (
            jsonify(
                {
                    "success": True,
                    "message": "Conversation fetched successfully",
                    "data": response,
                }
            ),
            200,
        )
    except Exception as e:
        print(f"Error fetching conversation: {e}")
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Server error: Could not fetch conversation",
                }
            ),
            500,
        )
