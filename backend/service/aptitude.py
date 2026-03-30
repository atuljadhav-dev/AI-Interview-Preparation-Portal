from utils.db import db
import random


def get_aptitude_questions(problem_type, num_questions=5, difficulty=None):
    # Fetch the document with the specified problem type
    document = db.problems.find_one({"problemType": problem_type})
    if not document:
        return []
    if difficulty:
        # Filter questions by difficulty if specified
        questions = [
            q for q in document["questions"] if q.get("difficulty") == difficulty
        ]
    else:
        questions = document["questions"]
    # Shuffle the questions and return the specified number
    random.shuffle(questions)
    return questions[:num_questions]
