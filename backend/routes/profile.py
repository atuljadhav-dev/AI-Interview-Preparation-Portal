from flask import Blueprint, request, jsonify
from pypdf import PdfReader
from service.profile import getProfile, createProfile,updateProfile
import json
from service.ai import convertTextToJSON
profile_bp = Blueprint('profile', __name__)
@profile_bp.route("/profile/<userId>", methods=["GET"])
def get_profile(userId):
    resumes = getProfile(userId)
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
    file = request.files["file"]
    data = request.form.to_dict()
    if file.filename == "":
        return jsonify({
            "success": False,
            "error": "No selected file"
        }), 400
    if not data or 'userId' not in data :
        return jsonify({
            "success": False,
            "error": "userId and resume are required"
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
    resume=json.loads(ai.text)
    try:
        profile = createProfile(data['userId'], resume)
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
    file = request.files["file"]
    data = request.form.to_dict()
    if file.filename == "":
        return jsonify({
            "success": False,
            "error": "No selected file"
        }), 400
    if not data or 'userId' not in data :
        return jsonify({
            "success": False,
            "error": "userId and resume are required"
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
    resume=json.loads(ai.text)
    try:
        profile = updateProfile(data['userId'], resume)
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