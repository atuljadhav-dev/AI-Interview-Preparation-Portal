from flask import Blueprint, request, jsonify
from service.interview import createInterview, getInterview,getSpecificInterview
from service.ai import generateQuestions
import json
from routes.auth import verify_jwt 
from utils.limiter import limiter
interview_bp = Blueprint('interview', __name__)
@interview_bp.route("/interview", methods=["POST"])
@limiter.limit("5 per minute") # Limit to 5 requests per minute
def create_interview():
    token_user = verify_jwt(request)
    if not token_user:
        return jsonify({
            "success": False, 
            "error": "Unauthorized"
            }), 401
    data=request.get_json()
    if not data:
        return jsonify({
            "success":False,
            "error":"No data provided"
            }),400
    try:
        job_description=data['jobDescription']
        round_name=data['round_name']
        resume=data['resume']
        title=data["jobRole"]
        resumeId=data["resumeId"]
        if not all([job_description, round_name, resume, title,resumeId]):
            return jsonify({
                "success":False,
                "error":"Invalid input data"
                }),400
        response=generateQuestions(job_description,round_name,resume)
        if response is None:
            return jsonify({
                "success":False,
                "error":"AI response error"
            }),500
        response=json.loads(response.text)
    except Exception as e:
        return jsonify({
            "success":False,
            "error":"Server error: Could not generate questions",
            }),500
    try:
        interview = createInterview( title=title,round_name=round_name,userId=token_user,description=job_description,question_answer=response,resumeId=resumeId)
        
        if "_id" in interview:
            interview["_id"] = str(interview["_id"])
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Could not create interview",
        }), 500
    return jsonify({
        "success": True,
        "message": "Interview created successfully!",
        "data": interview
    }), 201
@interview_bp.route("/interview", methods=["GET"])
@limiter.limit("10 per minute") # Limit to 10 requests per minute
def get_All_interview():
    token_user = verify_jwt(request)
    if not token_user :
        return jsonify({
            "success": False, 
            "error": "Unauthorized"
            }), 401
    try:
        interviews = getInterview(token_user)
        interview_list = []
        for interview in interviews:
            if "_id" in interview:
                interview["_id"] = str(interview["_id"])
            interview_list.append(interview)
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Server error: Could not fetch interviews",
            
        }), 500
    return jsonify({
        "success": True,
        "message": "Interviews fetched successfully",
        "data": interview_list
    }), 200

@interview_bp.route("/interview/specific/<interviewId>", methods=["GET"])
@limiter.limit("10 per minute") # Limit to 10 requests per minute
def get_specific_interview(interviewId):
    userId = verify_jwt(request)
    if not userId:
        return jsonify({
            "success": False, 
            "error": "Unauthorized"
            }), 401
    try:
        interview = getSpecificInterview(interviewId)
        if not interview or interview["userId"] != userId:
            return jsonify({
                "success": False,
                "error": "Interview not found"
            }), 404
        interview["_id"] = str(interview["_id"])
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Server error: Could not fetch interview",
        }), 500
    return jsonify({
        "success": True,
        "message": "Interview fetched successfully",
        "data": interview
    }), 200