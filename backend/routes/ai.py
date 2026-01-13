from flask import Blueprint,request,jsonify
import json
from service.ai import generateFeedback,AIInterviewStimulation,generateATSReport,generateApplicationEmail,generateATSfriendlyResume
from routes.auth import verifyJWT 
from utils.limiter import limiter
ai_bp=Blueprint('ai',__name__)

@ai_bp.route("/feedback",methods=["POST"])
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

@ai_bp.route("/simulation", methods=["POST"])
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
    
@ai_bp.route("/ats-report", methods=["POST"])
@limiter.limit("5 per minute") # Limit to 5 requests per minute
def atsReport():
    userId = verifyJWT(request)
    if not userId:
        return jsonify({
            "success": False, 
            "error": "Unauthorized"
            }), 401

    data = request.get_json()
    if not data or 'resume' not in data:
        return jsonify({
            "success": False, 
            "error": "No resume text provided"
            }), 400

    resume = data['resume']
    jobDescription = data['jobDescription']
    try:
        report = generateATSReport(jobDescription,resume)
        return jsonify({
            "success": True,
            "message": "ATS report generated successfully",
            "data": json.loads(report.text)
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
    
@ai_bp.route("/email", methods=["POST"])
@limiter.limit("10 per minute") # Limit to 10 requests per minute
def applicationEmail():
    userId = verifyJWT(request)
    if not userId:
        return jsonify({
            "success": False, 
            "error": "Unauthorized"
            }), 401

    data = request.get_json()
    if not data or 'jobDescription' not in data or 'companyName' not in data :
        return jsonify({
            "success": False, 
            "error": "Incomplete data provided"
            }), 400

    jobDescription = data['jobDescription']
    companyName = data['companyName']
    try:
        emailContent = generateApplicationEmail(jobDescription, companyName)
        return jsonify({
            "success": True,
            "message": "Application email generated successfully",
            "data": json.loads(emailContent.text)
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
    
@ai_bp.route("/resume",methods=["POST"])
@limiter.limit("10 per minute")
def buildATSfriendlyResume():
    '''Generate ATS friendly resume based on resumeContent, jobDescription'''
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
        resume=data['resume']
        jobDescription=data['jobDescription']
        atsReport=data['atsReport']
        additionalResumes=data['additionalResumes']
        if not resume:
            return jsonify({
                "success":False,
                "error":"Resume is required."
                }),400
        response=generateATSfriendlyResume(resume, jobDescription=jobDescription,atsReport=atsReport,additionalResumes=additionalResumes)
        if response is None:
            return jsonify({
                "success":False,
                "error":"AI response error"
            }),500
        return jsonify({
            "success":True,
            "message":"ATS friendly resume generated successfully",
            "data":json.loads(response.text)
            }),201
    except Exception as e:
        return jsonify({
            "success":False,
            "error":"Server error: Could not generate ATS friendly resume",
            }),500