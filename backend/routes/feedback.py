from flask import Blueprint, jsonify, request
from service.feedback import addFeedback, getFeedBack, allFeedBack
from service.interview import setFeedback
from routes.auth import verifyJWT
from utils.limiter import limiter

feedback_bp = Blueprint("feedback", __name__)


@feedback_bp.route("/feedback", methods=["POST", "GET"])
@limiter.limit("10 per minute")  # Limit to 10 requests per minute
def feedback():
    if request.method == "POST":
        userId = verifyJWT(request)
        if not userId:
            return jsonify({"success": False, "error": "Unauthorized"}), 401

        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
        try:
            interviewId = data["interviewId"]
            feedback = data["feedback"]
            if not interviewId or not feedback:
                return (
                    jsonify(
                        {
                            "success": False,
                            "error": "interviewId and feedback are required",
                        }
                    ),
                    400,
                )
            response = addFeedback(interviewId, feedback, userId)
            setFeedback(interviewId, response["_id"])
            return (
                jsonify(
                    {
                        "success": True,
                        "message": "Feedback created successfully",
                        "data": response,
                    }
                ),
                201,
            )
        except Exception as e:
            return (
                jsonify(
                    {
                        "success": False,
                        "error": "Server error: Could not create feedback",
                    }
                ),
                500,
            )
    if request.method == "GET":
        userId = verifyJWT(request)
        if not userId:
            return jsonify({"success": False, "error": "Unauthorized Access"}), 401
        page= request.args.get("page", default=1, type=int)
        limit= request.args.get("limit", default=9, type=int)
        if page < 1:
            page = 1
        if limit < 1:
            limit = 9
        feedbacks, total_pages, total_feedbacks = allFeedBack(userId,page,limit)
        return (
            jsonify(
                {
                    "data": {
                        "feedbacks": feedbacks,
                        "totalPages": total_pages,
                        "totalFeedbacks": total_feedbacks,
                    },
                    "message": "All feedback fetched successfully",
                    "success": True,
                }
            ),
            200,
        )


@feedback_bp.route("/feedback/<interviewId>", methods=["GET"])
@limiter.limit("10 per minute")  # Limit to 10 requests per minute
def getFeedbackRoute(interviewId):
    userId = verifyJWT(request)
    if not userId:
        return jsonify({"success": False, "error": "Unauthorized"}), 401
    try:
        feedback = getFeedBack(interviewId, userId)
        if not feedback:
            return jsonify({"success": False, "error": "Feedback not found"}), 404
        return (
            jsonify(
                {
                    "success": True,
                    "message": "Feedback fetched successfully",
                    "data": feedback,
                }
            ),
            200,
        )
    except Exception as e:
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Server error: Could not fetch feedback",
                }
            ),
            500,
        )
