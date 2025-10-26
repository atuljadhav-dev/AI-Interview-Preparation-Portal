from flask import Blueprint, request, jsonify
from service.interview import createInterview, getInterview,getSpecificInterview
from service.ai import generateQuestions
import json
interview_bp = Blueprint('interview', __name__)
@interview_bp.route("/interview", methods=["POST"])
def create_interview():
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
        userId=data['userId']
        title=data["jobRole"]
        if not job_description or job_description.strip()=="" or not round_name or round_name.strip()=="" or not resume or not title or title.strip()=="" or not userId:
            return jsonify({
                "success":False,
                "error":"Invalid input data"
                }),400
        response=generateQuestions(job_description,round_name,resume)
        response=json.loads(response.text)
    except Exception as e:
        return jsonify({
            "success":False,
            "error":"Server error: Could not generate questions",
            }),500
    try:
        interview = createInterview(userId, title,round_name,description=job_description,question_answer=response)
        
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
@interview_bp.route("/interview/<userId>", methods=["GET"])
def get_All_interview(userId):
    try:
        if not userId:
            return jsonify({
                "success": False,
                "error": "userId is required"
            }), 400
        interviews = getInterview(userId)
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
def get_specific_interview(interviewId):
    try:
        interview = getSpecificInterview(interviewId)
        if not interview:
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