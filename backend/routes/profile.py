from flask import Blueprint, request, jsonify
from pypdf import PdfReader
from service.profile import getProfile, createProfile,updateProfile
import json
from service.ai import convertTextToJSON
from routes.auth import verify_jwt 
profile_bp = Blueprint('profile', __name__)
@profile_bp.route("/profile", methods=["GET"])
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
def create_profile():
    token_user = verify_jwt(request)
    if not token_user:
        return jsonify({
            "success": False, 
            "error": "Unauthorized"
            }), 401
    file = request.files["file"]
    data = request.form.to_dict()
    if file.filename == "":
        return jsonify({
            "success": False,
            "error": "No selected file"
        }), 400
    if not data  :
        return jsonify({
            "success": False,
            "error": "Resume data is required"
        }), 400
   
    try:
        reader = PdfReader(file)
        extracted_text = ""
        for page in reader.pages:
            extracted_text += page.extract_text() or ""
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Server error: Failed to read PDF file",
        }), 500
    ai=convertTextToJSON(extracted_text)
    try:
        resume=json.loads(ai.text)
        profile = createProfile(token_user, resume, data.get('name', '')) 
        if "_id" in profile:
            profile["_id"] = str(profile["_id"])
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Server error: Could not create profile in database",
        }), 500
    return jsonify({
        "success": True,
        "message": "Profile created successfully!",
        "data": profile
    }), 201

@profile_bp.route("/profile", methods=["PUT"])
def update_profile():
    token_user = verify_jwt(request)
    if not token_user:
        return jsonify({
            "success": False, 
            "error": "Unauthorized"
            }), 401

    file = request.files["file"]
    data = request.form.to_dict()
    if file.filename == "":
        return jsonify({
            "success": False,
            "error": "No selected file"
        }), 400
    if not data  :
        return jsonify({
            "success": False,
            "error": "Resume are required"
        }), 400
    try:
        reader = PdfReader(file)
        extracted_text = ""
        for page in reader.pages:
            extracted_text += page.extract_text() or ""
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Server error: Failed to read PDF file",
        }), 500
    ai=convertTextToJSON(extracted_text)
    try:
        resume = json.loads(ai.text)
        profile = updateProfile(token_user, resume)
        if "_id" in profile:
            profile["_id"] = str(profile["_id"])
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Server error: Could not update profile in database",
        }), 500
    return jsonify({
        "success": True,
        "message": "Profile updated successfully!",
        "data": profile
    }), 201