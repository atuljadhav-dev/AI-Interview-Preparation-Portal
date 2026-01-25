from flask import Blueprint, request, jsonify
from service.interview import createInterview, getInterview, getSpecificInterview
from service.ai import generateQuestions
import json
from routes.auth import verifyJWT
from utils.limiter import limiter

interview_bp = Blueprint("interview", __name__)


@interview_bp.route("/interview", methods=["POST"])
@limiter.limit("5 per minute")  # Limit to 5 requests per minute
def createInterviewRoute():
    userId = verifyJWT(request)
    if not userId:
        return jsonify({"success": False, "error": "Unauthorized"}), 401
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "No data provided"}), 400
    try:
        jobDescription = data["jobDescription"]
        roundName = data["roundName"]
        resume = data["resume"]
        title = data["jobRole"]
        resumeId = data["resumeId"]
        if not all([jobDescription, roundName, resume, title, resumeId]):
            return jsonify({"success": False, "error": "Invalid input data"}), 400
        response = generateQuestions(jobDescription, roundName, resume)
        if response is None:
            return jsonify({"success": False, "error": "AI response error"}), 500
        response = json.loads(response.text)
    except Exception as e:
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Server error: Could not generate questions",
                }
            ),
            500,
        )
    try:
        interview = createInterview(
            userId,
            title,
            roundName,
            jobDescription,
            resumeId,
            questionAnswer=response["questionAnswer"],
            skills=response["skills"],
        )

        if "_id" in interview:
            interview["_id"] = str(interview["_id"])
    except Exception as e:
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Could not create interview",
                }
            ),
            500,
        )
    return (
        jsonify(
            {
                "success": True,
                "message": "Interview created successfully!",
                "data": interview,
            }
        ),
        201,
    )


@interview_bp.route("/interview", methods=["GET"])
@limiter.limit("10 per minute")  # Limit to 10 requests per minute
def getAllInterview():
    userId = verifyJWT(request)
    if not userId:
        return jsonify({"success": False, "error": "Unauthorized"}), 401
    try:
        interviews = getInterview(userId)
        interviewList = []
        for interview in interviews:
            if "_id" in interview:
                interview["_id"] = str(interview["_id"])
            interviewList.append(interview)
    except Exception as e:
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Server error: Could not fetch interviews",
                }
            ),
            500,
        )
    return (
        jsonify(
            {
                "success": True,
                "message": "Interviews fetched successfully",
                "data": interviewList,
            }
        ),
        200,
    )


@interview_bp.route("/interview/<interviewId>", methods=["GET"])
@limiter.limit("100 per minute")  # Limit to 10 requests per minute
def getSpecificInterviewRoute(interviewId):
    userId = verifyJWT(request)
    if not userId:
        return jsonify({"success": False, "error": "Unauthorized"}), 401
    try:
        interview = getSpecificInterview(interviewId)
        if not interview or interview["userId"] != userId:
            return jsonify({"success": False, "error": "Interview not found"}), 404
        interview["_id"] = str(interview["_id"])
    except Exception as e:
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Server error: Could not fetch interview",
                }
            ),
            500,
        )
    return (
        jsonify(
            {
                "success": True,
                "message": "Interview fetched successfully",
                "data": interview,
            }
        ),
        200,
    )
