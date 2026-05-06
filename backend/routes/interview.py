from flask import Blueprint, request, jsonify
from service.interview import createInterview, getInterview, getSpecificInterview
from service.ai import generateQuestions
from service.resume import getResumeById
import json
from routes.auth import verifyJWT
from utils.limiter import limiter
from service.job import saveJob, getJobByHash, getSpecificJob
from utils.normalizeText import normalizeText

interview_bp = Blueprint("interview", __name__)


@interview_bp.route("/interview", methods=["POST"])
@limiter.limit("100 per minute")  # Limit to 5 requests per minute
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
        title = data["title"]
        resumeId = data["resumeId"]
        resume = (
            data["resume"]
            if "resume" in data
            else getResumeById(userId, resumeId)["resume"]
        )
        jobId = data["jobId"] if "jobId" in data else None
        jobDesc = normalizeText(jobDescription)
        job = None
        if not all([roundName, resume, resumeId]):
            return jsonify({"success": False, "error": "Invalid input data"}), 400
        if jobId:
            job = getSpecificJob(jobId)
            if not job:
                return jsonify({"success": False, "error": "Job not found"}), 404
        else:
            job = getJobByHash(jobDesc)
            if not job:
                if not jobDescription or not title:
                    return (
                        jsonify(
                            {
                                "success": False,
                                "error": "Job description and title are required for new job",
                            }
                        ),
                        400,
                    )
                job = saveJob(userId, title, jobDescription)
        jobId = str(job["_id"])
        response = generateQuestions(jobDesc, roundName, resume)
        print(f"AI response: {response}")
        if response is None:
            return jsonify({"success": False, "error": "AI response error"}), 500
        response = json.loads(response.text)
    except Exception as e:
        print(f"Error in createInterviewRoute: {e}")
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
            jobId,
            roundName,
            resumeId,
            questionAnswer=response["questionAnswer"],
            skills=response["skills"],
        )

        if "_id" in interview:
            interview["_id"] = str(interview["_id"])
    except Exception as e:
        print(f"Error creating interview: {e}")
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
@limiter.limit("100 per minute")  # Limit to 10 requests per minute
def getAllInterview():
    userId = verifyJWT(request)
    if not userId:
        return jsonify({"success": False, "error": "Unauthorized"}), 401
    page = request.args.get("page", default=1, type=int)
    limit = request.args.get("limit", default=9, type=int)
    status = request.args.get("status", default="all", type=str)
    # Ensure page and limit are positive integers
    if page < 1:
        page = 1
    if limit < 1:
        limit = 9
    if status not in ["all", "done", "scheduled"]:
        status = "all"
    try:
        interviews, totalPages, totalInterviews = getInterview(
            userId, page, limit, status
        )
        interviewList = []
        for interview in interviews:
            if "_id" in interview:
                interview["_id"] = str(interview["_id"])
            interviewList.append(interview)
    except Exception as e:
        print(f"Error fetching interviews: {e}")
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
                "data": {
                    "interviews": interviewList,
                    "totalPages": totalPages,
                    "totalInterviews": totalInterviews,
                },
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
        print(f"Error fetching specific interview: {e}")
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
