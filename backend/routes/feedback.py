from flask import Blueprint, jsonify, request
from service.feedback import addFeedback, getFeedBack,allFeedBack
from service.interview import setFeedback
feedback_bp = Blueprint("feedback", __name__)

@feedback_bp.route("/feedback", methods=["POST","GET"])
def feedback():
    if request.method == "POST":
        data = request.get_json()
        if not data:
            return jsonify({
            "success": False,
            "error": "No data provided"
            }), 400
        try:
            interviewId = data["interviewId"]
            feedback = data["feedback"]
            if not interviewId or not feedback:
                return jsonify({
                    "success": False,
                    "error": "interviewId and feedback are required"
                }), 400
            response = addFeedback(interviewId, feedback)
            setFeedback(interviewId,response["_id"])
            return jsonify({
                "success": True,
                "message": "Feedback created successfully",
                "data": response
            }), 201
        except Exception as e:
            return jsonify({
                "success": False,
                "error": "Server error: Could not create feedback",
            }), 500
    if request.method == "GET":
        authToken = request.cookies.get("authToken")
        if not authToken:
            return jsonify({"success": False, "error": "Unauthorized Access"}), 401
        res=allFeedBack(request)
        return jsonify({
            "data":res,
            "message":"All feedback fetched successfully",
            "success":True    
        }),200
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
            "message": "Feedback fetched successfully",
            "data": feedback
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Server error: Could not fetch feedback",
        }), 500
