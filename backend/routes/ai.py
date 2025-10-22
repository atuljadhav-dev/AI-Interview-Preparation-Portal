from flask import Blueprint,request,jsonify
import json
from service.ai import generateQuestions,generateFeedback,AIInterviewStimulation
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
        response=generateFeedback(jobTitle,resume, questionAnswer, userAnswer, job_description, round_name)
        return jsonify({
            "success":True,
            "data":json.loads(response)
            }),200
    except Exception as e:
        return jsonify({
            "success":False,
            "error":"Could not generate feedback",
            "details":str(e)
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
        response=AIInterviewStimulation(questions,resume,jobDescription,round_name,content)
        return jsonify({
            "success":True,
            "data":response
            }),200
    except Exception as e:
        return jsonify({
            "success":False,
            "error":"Could not generate feedback",
            "details":str(e)
            }),500