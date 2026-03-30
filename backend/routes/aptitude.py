from flask import Blueprint, request, jsonify
from service.aptitude import get_aptitude_questions

aptitude_bp = Blueprint("aptitude", __name__)


@aptitude_bp.route("/questions", methods=["GET"])
def fetch_aptitude_questions():
    problem_type = request.args.get("problemType")
    num_questions = int(request.args.get("numQuestions", 5))
    difficulty = request.args.get("difficulty")

    if not problem_type:
        return jsonify({"error": "problemType is required", "success": False}), 400

    questions = get_aptitude_questions(problem_type, num_questions, difficulty)

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
