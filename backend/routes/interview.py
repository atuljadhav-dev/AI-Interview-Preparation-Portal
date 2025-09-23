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
        response=generateQuestions(job_description,round_name,resume)
        response=json.loads(response.text)
    except Exception as e:
        return jsonify({
            "success":False,
            "error":"Could not generate questions",
            "details":str(e)
            }),500
    try:
        interview = createInterview(userId, title,round_name,description=job_description,question_answer=response)
        
        if "_id" in interview:
            interview["_id"] = str(interview["_id"])
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Could not create interview in database",
            "details": str(e)
        }), 500
    return jsonify({
        "success": True,
        "message": "Interview created successfully!",
        "data": interview
    }), 201
@interview_bp.route("/interview/<userId>", methods=["GET"])
def get_All_interview(userId):
    try:
        interviews = getInterview(userId)
        interview_list = []
        for interview in interviews:
            if "_id" in interview:
                interview["_id"] = str(interview["_id"])
            interview_list.append(interview)
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Could not fetch interviews from database",
            "details": str(e)
        }), 500
    return jsonify({
        "success": True,
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
            "error": "Could not fetch interview from database",
            "details": str(e)
        }), 500
    return jsonify({
        "success": True,
        "data": interview
    }), 200