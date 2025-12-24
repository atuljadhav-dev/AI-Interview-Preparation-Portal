from flask import Blueprint,request,jsonify
import json
from service.ai import generateFeedback,AIInterviewStimulation
from routes.auth import verify_jwt 
from utils.limiter import limiter
ai_bp=Blueprint('ai',__name__)

@ai_bp.route("/generate-feedback",methods=["POST"])
@limiter.limit("5 per minute") # Limit to 5 requests per minute
def feedbackGeneration():
    '''Generate feedback based on resume, questionAnswer, userAnswer, jobTitle, jobDescription, roundName'''
    if not verify_jwt(request):# prevent unauthorized access
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
        resume=data['resume']
        questionAnswer=data['questionAnswer']
        userAnswer=data['userAnswer']
        jobTitle=data["jobTitle"]
        job_description=data['jobDescription']
        round_name=data['roundName']
        if not all([resume, questionAnswer, userAnswer, jobTitle, job_description, round_name]):# validate input
            return jsonify({
                "success":False,
                "error":"Invalid input data"
                }),400
        response=generateFeedback(jobTitle,resume, questionAnswer, userAnswer, job_description, round_name)
        return jsonify({
            "success":True,
            "message":"Feedback generated successfully",
            "data":json.loads(response)# convert string response to json
            }),201
    except Exception as e:
        return jsonify({
            "success":False,
            "error":"Server error: Could not generate feedback",
            }),500

@ai_bp.route("/interview-stimulation", methods=["POST"])
@limiter.limit("10 per minute") # Limit to 10 requests per minute
def interviewStimulation():
    '''Generate interview simulation based on questions, resume, jobDescription, roundName, content'''
    if not verify_jwt(request):
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
        questions=data['questions']
        resume=data['resume']
        jobDescription=data['jobDescription']
        round_name=data['roundName']
        content=data['content']
        if not all([questions, resume, jobDescription, round_name, content]):
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
            }),500