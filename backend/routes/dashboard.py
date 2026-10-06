from flask import Blueprint,  jsonify,g
from service.dashboard import getDashboardData
from utils.limiter import limiter

dashboard_bp = Blueprint(
    "dashboard",
    __name__,
)


@dashboard_bp.route("/stats", methods=["GET"])
@limiter.limit("10 per minute")  # Limit to 10 requests per minute
def getStats():
    userId = g.userId
    try:
        data = getDashboardData(userId)
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        print(f"Error fetching dashboard data: {e}")
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Server error: Could not fetch dashboard data",
                }
            ),
            500,
        )
