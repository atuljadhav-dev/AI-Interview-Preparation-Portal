from flask import Blueprint, request, jsonify
from service.atsMain import calculateAtsReport
from routes.auth import verifyJWT
from utils.limiter import limiter
from service.atsDb import (
    saveATSReport,
    getATSReport,
    getAllATSReports,
    getATSReportById,
    getATSReportByResumeId,
)

ats_bp = Blueprint("ats", __name__)


@ats_bp.route("/generate", methods=["POST"])
@limiter.limit("5 per minute")  # Limit to 5 requests per minute
def generateATSReportRoute():
    userId = verifyJWT(request)
    if not userId:
        return jsonify({"success": False, "error": "Unauthorized"}), 401
    data = request.get_json()
    if not data or "resume" not in data or "jobDescription" not in data:
        return (
            jsonify(
                {"success": False, "error": "Resume and job description are required"}
            ),
            400,
        )
    resume = data["resume"]
    jobDescription = data["jobDescription"]
    try:
        report = getATSReport(userId, resume["_id"], jobDescription)
        if report:
            return (
                jsonify(
                    {
                        "success": True,
                        "message": "ATS report fetched successfully",
                        "data": report,
                    }
                ),
                200,
            )
        report = calculateAtsReport(jobDescription, resume["url"])
        report = saveATSReport(userId, resume["_id"], jobDescription, report)
        return (
            jsonify(
                {
                    "success": True,
                    "message": "ATS report generated successfully",
                    "data": report,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@ats_bp.route("/reports", methods=["GET"])
@limiter.limit("5 per minute")  # Limit to 5 requests per minute
def getATSReportsRoute():
    userId = verifyJWT(request)
    if not userId:
        return jsonify({"success": False, "error": "Unauthorized"}), 401
    try:
        reports = getAllATSReports(userId)
        return (
            jsonify(
                {
                    "success": True,
                    "message": "ATS reports fetched successfully",
                    "data": reports,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@ats_bp.route("/report/<reportId>", methods=["GET"])
@limiter.limit("5 per minute")  # Limit to 5 requests per minute
def getATSReportByIdRoute(reportId):
    userId = verifyJWT(request)
    if not userId:
        return jsonify({"success": False, "error": "Unauthorized"}), 401
    try:
        report = getATSReportById(userId, reportId)
        if not report:
            return jsonify({"success": False, "error": "Report not found"}), 404
        return (
            jsonify(
                {
                    "success": True,
                    "message": "ATS report fetched successfully",
                    "data": report,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@ats_bp.route("/report/resume/<resumeId>", methods=["GET"])
@limiter.limit("5 per minute")  # Limit to 5 requests per minute
def getATSReportByResumeIdRoute(resumeId):
    userId = verifyJWT(request)
    if not userId:
        return jsonify({"success": False, "error": "Unauthorized"}), 401
    try:
        report = getATSReportByResumeId(userId, resumeId)
        if not report:
            return jsonify({"success": False, "error": "Report not found"}), 404
        return (
            jsonify(
                {
                    "success": True,
                    "message": "ATS report fetched successfully",
                    "data": report,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
