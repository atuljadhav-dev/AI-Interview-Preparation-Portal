from flask import Blueprint, request, jsonify
from service.job import saveJob, getJobByHash, getSpecificJob, getJobs
from routes.auth import verifyJWT

job_bp = Blueprint("job", __name__)


@job_bp.route("/job", methods=["POST"])
def createJobRoute():
    userId = verifyJWT(request)
    if not userId:
        return jsonify({"success": False, "error": "Unauthorized"}), 401
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "No data provided"}), 400
    try:
        jobDescription = data["jobDescription"]
        title = data["title"]
        if not jobDescription or not title:
            return (
                jsonify(
                    {
                        "success": False,
                        "error": "Job description and title are required",
                    }
                ),
                400,
            )
        job = getJobByHash(jobDescription)
        if job:
            return jsonify(
                {
                    "success": True,
                    "jobId": str(job["_id"]),
                    "message": "Job already exists",
                }
            )
        job = saveJob(userId, title, jobDescription)
        return jsonify({"success": True, "jobId": str(job["_id"])})
    except Exception as e:
        print(f'Error saving job: {e}')
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Error saving job ",
                }
            ),
            500,
        )


@job_bp.route("/job/<jobId>", methods=["GET"])
def getJobRoute(jobId):
    userId = verifyJWT(request)
    if not userId:
        return jsonify({"success": False, "error": "Unauthorized"}), 401
    try:
        job = getSpecificJob(jobId)
        if not job:
            return jsonify({"success": False, "error": "Job not found"}), 404
        if str(job["userId"]) != userId:
            return jsonify({"success": False, "error": "Forbidden"}), 403
        job["_id"] = str(job["_id"])
        del job["userId"]  # Remove userId before sending response
        del job["dateCreated"]  # Remove dateCreated before sending response
        del job["jobHash"]  # Remove jobHash before sending response
        return jsonify({"success": True, "data": job})
    except Exception as e:
        print(f'Error fetching job: {e}')
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Error fetching job",
                }
            ),
            500,
        )


@job_bp.route("/jobs", methods=["GET"])
def getJobsRoute():
    userId = verifyJWT(request)
    if not userId:
        return jsonify({"success": False, "error": "Unauthorized"}), 401
    try:
        page = request.args.get("page", 1)
        limit = request.args.get("limit", 9)
        jobs, total_pages, total_jobs = getJobs(userId, page, limit)
        for job in jobs:
            job["_id"] = str(job["_id"])
            del job["userId"]  # Remove userId before sending response
            del job["dateCreated"]  # Remove dateCreated before sending response
            del job["jobHash"]  # Remove jobHash before sending response
        return (
            jsonify(
                {
                    "success": True,
                    "data": {
                        "jobs": jobs,
                        "totalPages": total_pages,
                        "totalJobs": total_jobs,
                    },
                    "message": "Jobs fetched successfully",
                }
            ),
            200,
        )
    except Exception as e:
        print(f'Error fetching jobs: {e}')
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Error fetching jobs",
                }
            ),
            500,
        )
