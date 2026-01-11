from flask import Blueprint, request, jsonify
import os
from service.profile import getProfile, createProfile,deleteProfile
import json
from service.ai import convertTextToJSON,convertPDFToJSON
from routes.auth import verify_jwt 
from utils.limiter import limiter
from service.cloudinary import uploadResumeToCloudinary,deleteResumeFromCloudinary
from service.pdfParsing import process_resume_pdf,is_poor_extraction
profile_bp = Blueprint('profile', __name__)
@profile_bp.route("/profile", methods=["GET"])
@limiter.limit("10 per minute") # Limit to 10 requests per minute
def get_profile():
    token_user = verify_jwt(request)
    if not token_user :
        return jsonify({
            "success": False, 
            "error": "Unauthorized"}), 401
    resumes = getProfile(token_user)
    if not resumes:
        return jsonify({
            "success": False,
            "error": "Profile not found"
        }), 404
    resumeList=[]
    for resume in resumes:
        if "_id" in resume:
            resume["_id"] = str(resume["_id"])
            resumeList.append(resume)
    return jsonify({
        "success": True,
        "message": "Profile fetched successfully",
        "data": resumeList
    }), 200

@profile_bp.route("/profile", methods=["POST"])
@limiter.limit("5 per minute") # Limit resume uploads to 5 per minute
def create_profile():
    token_user = verify_jwt(request)
    if not token_user:
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
    file_size = file.tell()
    if file_size > MAX_FILE_SIZE:
        return jsonify({"success": False, "error": "File size exceeds 2MB limit"}), 400
    file.seek(0)
    data = request.form.to_dict()
    if not data  :
        return jsonify({
            "success": False,
            "error": "Resume data is required"
        }), 400
    
    upload_url,public_id=uploadResumeToCloudinary(file)
    if not upload_url:
        return jsonify({
            "success": False,
            "error": "Failed to upload resume to cloud storage"
        }), 500
    file.seek(0)
    extracted_text, error, status = process_resume_pdf(file)
    
    if error:
        deleteResumeFromCloudinary(public_id)
        return jsonify({"success": False, "error": error}), status
    isInValidText=is_poor_extraction(extracted_text)
    ai=None
    if isInValidText:
        ai=convertPDFToJSON(upload_url)
    else:
        ai=convertTextToJSON(extracted_text)
    if ai is None:
        deleteResumeFromCloudinary(public_id)
        return jsonify({
                "success":False,
                "error":"AI response error"
            }),500
    profile=None
    try:
        resume=json.loads(ai.text)
        profile = createProfile(token_user, resume, data.get('name', ''), upload_url,public_id) 
        if "_id" in profile:
            profile["_id"] = str(profile["_id"])
    except Exception as e:
        deleteResumeFromCloudinary(public_id)
        if profile:
            deleteProfile(token_user,profile.get("_id"))
        return jsonify({
            "success": False,
            "error": "Server error: Could not create profile in database",
        }), 500
    return jsonify({
        "success": True,
        "message": "Profile created successfully!",
        "data": profile
    }), 201




@profile_bp.route("/profile", methods=["DELETE"])
@limiter.limit("5 per minute") # Limit profile deletions to 5 per minute
def deleteUser():
    userId = verify_jwt(request)
    if not userId:
        return jsonify({
            "success": False, 
            "error": "Unauthorized"
            }), 401
    profileId = request.args.get('profileId')
    if not profileId:
        return jsonify({
            "success": False,
            "error": "profileId is required"
        }), 400
    try:
        res=deleteProfile(userId,profileId)
        if not res:
            return jsonify({
                "success": False,
                "error": "Profile not found or could not be deleted"
            }), 404
        res["_id"] = str(res["_id"])
        deleteResumeFromCloudinary(res.get("public_id"))
        return jsonify({
            "success": True,
            "message": "Profile deleted successfully",
            "data": res
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Server error: Could not delete profile",
        }), 500
    
