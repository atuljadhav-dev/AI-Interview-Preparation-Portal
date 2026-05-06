from flask import Blueprint, request, jsonify
from service.aptitude import (
    getResult,
    get10AptitudeTests,
    getSet,
    saveSet,
    saveResult,
    getResults,
    getResultById,
)
from routes.auth import verifyJWT

aptitude_bp = Blueprint("aptitude", __name__)


@aptitude_bp.route("/set", methods=["GET", "POST"])
def fetchAptitudeQuestions():
    if request.method == "POST":
        data = request.get_json()
        set = data.get("set")
        if not set:
            return (
                jsonify({"error": "Set data is required", "success": False}),
                400,
            )
        savedSet = saveSet(set)
        return (
            jsonify(
                {
                    "message": "Aptitude test set saved successfully",
                    "success": True,
                    "data": savedSet,
                }
            ),
            201,
        )

    id = request.args.get("id")
    if not id:
        return (
            jsonify({"error": "Set ID is required", "success": False}),
            400,
        )
    questions = getSet(id)
    if not questions:
        return (
            jsonify(
                {
                    "error": "No questions found for the specified problem type",
                    "success": False,
                }
            ),
            404,
        )

    return (
        jsonify(
            {
                "message": "Aptitude questions fetched successfully",
                "success": True,
                "data": questions,
            }
        ),
        200,
    )


@aptitude_bp.route("/result", methods=["POST", "GET"])
def checkAptitudeResult():
    userId = verifyJWT(request)
    if not userId:
        return jsonify({"success": False, "error": "Unauthorized"}), 401
    if request.method == "GET":
        resultId = request.args.get("id")
        if not resultId:
            page = request.args.get("page", default=1, type=int)
            limit = request.args.get("limit", default=10, type=int)
            results, totalPages, totalResults = getResults(userId, page, limit)
            return (
                jsonify(
                    {
                        "message": "Aptitude test results fetched successfully",
                        "success": True,
                        "data": {
                            "results": results,
                            "totalPages": totalPages,
                            "totalResults": totalResults,
                        },
                    }
                ),
                200,
            )
        result = getResultById(userId, resultId)
        if not result:
            return (
                jsonify(
                    {"error": "No results found for the specified ID", "success": False}
                ),
                404,
            )

        return (
            jsonify(
                {
                    "message": "Aptitude test result fetched successfully",
                    "success": True,
                    "data": result,
                }
            ),
            200,
        )
    data = request.get_json()
    userAnswers = data.get("userAnswers")
    setId = data.get("setId")
    if not userAnswers:
        return (
            jsonify({"error": "userAnswers are required", "success": False}),
            400,
        )
    result = saveResult(setId, userId, userAnswers)
    if not result:
        return (
            jsonify({"error": "Failed to save the result", "success": False}),
            500,
        )
    return (
        jsonify(
            {
                "message": "Aptitude test results calculated successfully",
                "success": True,
                "data": result,
            }
        ),
        200,
    )


@aptitude_bp.route("/sets", methods=["GET"])
def fetch10AptitudeTests():
    tests = get10AptitudeTests()

    if not tests:
        return (
            jsonify({"error": "No aptitude tests found", "success": False}),
            404,
        )

    return (
        jsonify(
            {
                "message": "10 Aptitude tests fetched successfully",
                "success": True,
                "data": tests,
            }
        ),
        200,
    )
