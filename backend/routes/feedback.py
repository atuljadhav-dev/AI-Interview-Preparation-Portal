from flask import Blueprint, jsonify, request
from service.feedback import addFeedback, getFeedBack,allFeedBack
from service.interview import setFeedback
from routes.auth import verify_jwt 
from utils.limiter import limiter
feedback_bp = Blueprint("feedback", __name__)

@feedback_bp.route("/feedback", methods=["POST","GET"])
@limiter.limit("10 per minute") # Limit to 10 requests per minute
def feedback():
    if request.method == "POST":
        if not verify_jwt(request):
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
        token_user=verify_jwt(request)
        if not token_user:
            return jsonify({
                "success": False, 
                "error": "Unauthorized Access"
                }), 401
        res=allFeedBack(token_user)
        return jsonify({
            "data":res,
            "message":"All feedback fetched successfully",
            "success":True    
        }),200
@feedback_bp.route("/feedback/<interviewId>", methods=["GET"])
@limiter.limit("10 per minute") # Limit to 10 requests per minute
def get_feedback(interviewId):
    userId=verify_jwt(request)
    if not userId :
        return jsonify({
            "success": False, 
            "error": "Unauthorized"
            }), 401
    try:
        feedback = getFeedBack(interviewId,userId)
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