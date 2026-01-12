from flask import Blueprint,request,jsonify
import json
from service.ai import generateFeedback,AIInterviewStimulation
from routes.auth import verifyJWT 
from utils.limiter import limiter
ai_bp=Blueprint('ai',__name__)

@ai_bp.route("/generate-feedback",methods=["POST"])
@limiter.limit("5 per minute") # Limit to 5 requests per minute
def feedbackGeneration():
    '''Generate feedback based on resume, questionAnswer, userAnswer, jobTitle, jobDescription, roundName'''
    if not verifyJWT(request):# prevent unauthorized access
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
        jobDescription=data['jobDescription']
        roundName=data['roundName']
        skills=data['skills']
        if not all([resume, questionAnswer, userAnswer, jobTitle, jobDescription, roundName,skills]):# validate input
            return jsonify({
                "success":False,
                "error":"Invalid input data"
                }),400
        response=generateFeedback(jobTitle,resume, questionAnswer, userAnswer, jobDescription, roundName,skills)
        if response is None:
            return jsonify({
                "success":False,
                "error":"AI response error"
            }),500
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
    if not verifyJWT(request):
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
        roundName=data['roundName']
        content=data['content']
        if not all([questions, resume, jobDescription, roundName, content]):
            return jsonify({
                "success":False,
                "error":"Invalid input data"
                }),400
        response=AIInterviewStimulation(questions,resume,jobDescription,roundName,content)
        if response is None:
            return jsonify({
                "success":False,
                "error":"AI response error"
            }),500
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