from flask import Blueprint, request, jsonify
import os
from service.resume import getResume, createResume,deleteResume,checkExistResume
import json
from service.ai import convertTextToJSON,convertPDFToJSON
from routes.auth import verifyJWT 
from utils.limiter import limiter
from service.cloudinary import uploadResumeToCloudinary,deleteResumeFromCloudinary
from service.pdfParsing import processResumePdf,isPoorExtraction
resume_bp = Blueprint('resume', __name__)
@resume_bp.route("/resumes", methods=["GET"])
@limiter.limit("10 per minute") # Limit to 10 requests per minute
def getResumeRoute():
    userId = verifyJWT(request)
    if not userId :
        return jsonify({
            "success": False, 
            "error": "Unauthorized"}), 401
    resumes = getResume(userId)
    if not resumes:
        return jsonify({
            "success": False,
            "error": "Resume not found"
        }), 404
    resumeList=[]
    for resume in resumes:
        if "_id" in resume:
            resume["_id"] = str(resume["_id"])
            resumeList.append(resume)
    return jsonify({
        "success": True,
        "message": "Resume fetched successfully",
        "data": resumeList
    }), 200

@resume_bp.route("/resume", methods=["POST"])
@limiter.limit("5 per minute") # Limit resume uploads to 5 per minute
def createResumeRoute():
    userId = verifyJWT(request)
    if not userId:
        return jsonify({
            "success": False, 
            "error": "Unauthorized"
            }), 401
    file = request.files.get("file")
    if not file:
        return jsonify({"success": False, "error": "No file uploaded"}), 400
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({"success": False, "error": "Only PDF files are supported"}), 400
    MAX_FILE_SIZE = 2 * 1024 * 1024  # 2MB
    
    # Check file size
    file.seek(0, os.SEEK_END)
    fileSize = file.tell()
    if fileSize > MAX_FILE_SIZE:
        return jsonify({"success": False, "error": "File size exceeds 2MB limit"}), 400
    file.seek(0)
    data = request.form.to_dict()
    if not data  :
        return jsonify({
            "success": False,
            "error": "Resume data is required"
        }), 400
    
    url,publicId=uploadResumeToCloudinary(file)
    if not url:
        return jsonify({
            "success": False,
            "error": "Failed to upload resume to cloud storage"
        }), 500
    file.seek(0)
    extractedText, error, status = processResumePdf(file)
    
    if error:
        deleteResumeFromCloudinary(publicId)
        return jsonify({"success": False, "error": error}), status
    isInValidText=isPoorExtraction(extractedText)
    ai=None
    if isInValidText:
        ai=convertPDFToJSON(url)
    else:
        ai=convertTextToJSON(extractedText)
    if ai is None:
        deleteResumeFromCloudinary(publicId)
        return jsonify({
                "success":False,
                "error":"AI response error"
            }),500
    resume=None
    try:
        resume=json.loads(ai.text)
        resume = createResume(userId, resume, data.get('name', ''), url,publicId) 
        if "_id" in resume:
            resume["_id"] = str(resume["_id"])
    except Exception as e:
        deleteResumeFromCloudinary(publicId)
        if resume:
            deleteResume(userId,resume.get("_id"))
        return jsonify({
            "success": False,
            "error": "Server error: Could not create resume in database",
        }), 500
    return jsonify({
        "success": True,
        "message": "Resume created successfully!",
        "data": resume
    }), 201

@resume_bp.route("/resume", methods=["DELETE"])
@limiter.limit("5 per minute") # Limit resume deletions to 5 per minute
def deleteUser():
    userId = verifyJWT(request)
    if not userId:
        return jsonify({
            "success": False, 
            "error": "Unauthorized"
            }), 401
    resumeId = request.args.get('resumeId')
    if not resumeId:
        return jsonify({
            "success": False,
            "error": "resumeId is required"
        }), 400
    try:
        res=deleteResume(userId,resumeId)
        if not res:
            return jsonify({
                "success": False,
                "error": "Resume not found or could not be deleted"
            }), 404
        res["_id"] = str(res["_id"])
        if res:
            try:
                deleteResumeFromCloudinary(res["publicId"])
            except Exception as e:
                return jsonify({
                    "success": False,
                    "error": "Resume deleted from database but failed to delete resume from cloud storage",
                }), 500
        return jsonify({
            "success": True,
            "message": "Resume deleted successfully",
            "data": res
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Server error: Could not delete resume",
        }), 500
    