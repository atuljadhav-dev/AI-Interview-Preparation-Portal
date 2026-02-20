from flask import Blueprint, request, jsonify
from routes.auth import verifyJWT
from service.dashboard import getDashboardData
from utils.limiter import limiter

dashboard_bp = Blueprint(
    "dashboard",
    __name__,
)


@dashboard_bp.route("/stats", methods=["GET"])
@limiter.limit("10 per minute")  # Limit to 10 requests per minute
def get_stats():
    userId = verifyJWT(request)
    if not userId:
        return jsonify({"success": False, "error": "Unauthorized"}), 401
    try:
        data = getDashboardData(userId)
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Server error: Could not fetch dashboard data",
                }
            ),
            500,
        )
