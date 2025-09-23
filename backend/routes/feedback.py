from flask import Blueprint, jsonify, request
from service.feedback import addFeedback, getFeedBack
from service.interview import setFeedback
feedback_bp = Blueprint("feedback", __name__)

@feedback_bp.route("/feedback", methods=["POST"])
def add_feedback():
    data = request.get_json()
    if not data:
        return jsonify({
            "success": False,
            "error": "No data provided"
        }), 400
    try:
        interviewId = data["interviewId"]
        feedback = data["feedback"]
        response = addFeedback(interviewId, feedback)
        setFeedback(interviewId,response["_id"])
        return jsonify({
            "success": True,
            "data": response
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Could not create feedback",
            "details": str(e)
        }), 500


@feedback_bp.route("/feedback/<interviewId>", methods=["GET"])
def get_feedback(interviewId):
    if not interviewId:
        return jsonify({
            "success": False,
            "error": "interviewId is required"
        }), 400
    try:
        feedback = getFeedBack(interviewId)
        if not feedback:
            return jsonify({
                "success": False,
                "error": "Feedback not found"
            }), 404
        return jsonify({
            "success": True,
            "data": feedback
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Could not fetch feedback from database",
            "details": str(e)
        }), 500
