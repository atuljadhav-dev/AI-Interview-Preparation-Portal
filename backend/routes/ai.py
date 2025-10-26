from flask import Blueprint,request,jsonify
import json
from service.ai import generateFeedback,AIInterviewStimulation
ai_bp=Blueprint('ai',__name__)

@ai_bp.route("/generate-feedback",methods=["POST"])
def feedbackGeneration():
    data=request.get_json()
    if not data:
        return jsonify({
            "success":False,
            "error":"No data provided"
            }),400
    try:
        resume=data['resume']
        questionAnswer=data['questionAnswer']
        userAnswer=data['userAnswer']
        jobTitle=data["jobTitle"]
        job_description=data['jobDescription']
        round_name=data['roundName']
        if not jobTitle or jobTitle.strip()=="" or not resume or not job_description or job_description.strip()=="" or not round_name or round_name.strip()=="" or not questionAnswer  or not userAnswer:
            return jsonify({
                "success":False,
                "error":"Invalid input data"
                }),400
        response=generateFeedback(jobTitle,resume, questionAnswer, userAnswer, job_description, round_name)
        return jsonify({
            "success":True,
            "message":"Feedback generated successfully",
            "data":json.loads(response)
            }),201
    except Exception as e:
        return jsonify({
            "success":False,
            "error":"Server error: Could not generate feedback",
            }),500

@ai_bp.route("/interview-stimulation",methods=["POST"])
def interviewStimulation():
    data=request.get_json()
    if not data:
        return jsonify({
            "success":False,
            "error":"No data provided"
            }),400
    try:
        questions=data['questions']
        resume=data['resume']
        jobDescription=data['jobDescription']
        round_name=data['roundName']
        content=data['content']
        if not questions or not resume or not jobDescription or jobDescription.strip()=="" or not round_name or round_name.strip()=="" or not content :
            return jsonify({
                "success":False,
                "error":"Invalid input data"
                }),400
        response=AIInterviewStimulation(questions,resume,jobDescription,round_name,content)
        return jsonify({
            "success":True,
            "message":"Interview simulation generated successfully",
            "data":response
            }),201
    except Exception as e:
        return jsonify({
            "success":False,
            "error":"Server error: Could not generate interview simulation",
            "details":str(e)
            }),500