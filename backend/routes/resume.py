from service.ai import generateATSReport
from routes.auth import verifyJWT
from utils.limiter import limiter
from flask import Blueprint, request, jsonify
import json

resume_bp = Blueprint('resume', __name__)
@resume_bp.route("/resume/ats-report", methods=["POST"])
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