from utils.db import db
import random
from bson import ObjectId
import datetime


def getAptitudeQuestions(numQuestions=30):
    categories = ["numerical", "verbal", "reasoning", "advanced"]
    maxPerCat = numQuestions // 3  # For 30, this is 10

    finalQuestions = []
    categoryCounts = {cat: 0 for cat in categories}

    # --- 1. Generate Randomized Sizes with 1/3 Cap ---
    remaining = numQuestions
    sizes = []
    for i in range(len(categories)):
        if i == len(categories) - 1:
            sizes.append(remaining)  # Last category takes the rest
        else:
            # Ensure we don't pick so many that others get 0,
            # and don't pick more than the 1/3 cap.
            lowerBound = max(4, remaining - (len(categories) - 1 - i) * maxPerCat)
            upperBound = min(maxPerCat, remaining - (len(categories) - 1 - i))

            size = random.randint(
                lowerBound, upperBound
            )  # Ensure at least 4 questions per category and not more than the maxPerCat
            sizes.append(size)
            remaining -= size

    # Create a map for easy lookup inside the loop
    categorySizeMap = dict(zip(categories, sizes))

    # --- 2. Database Fetching ---
    for cat in categories:
        query = {}
        # For verbal and reasoning, we can filter by difficulty if provided
        query["category"] = cat

        pipeline = [{"$match": query}, {"$sample": {"size": categorySizeMap[cat]}}]

        results = list(db.questions.aggregate(pipeline))

        for q in results:
            finalQuestions.append(q["id"])
            categoryCounts[cat] += 1
    random.shuffle(finalQuestions)  # Shuffle the final list to mix categories

    return {
        "questions": finalQuestions,
        "total": len(finalQuestions),
        "category": categoryCounts,
    }


def getResult(userAnswers):
    qids = list(userAnswers.keys())
    # Fetch all relevant questions in ONE go
    questionCursor = db.questions.find({"id": {"$in": qids}})
    questionsMap = {q["id"]: q for q in questionCursor}

    score = 0
    questions = []

    for qid, userAnswer in userAnswers.items():
        question = questionsMap.get(qid)
        if question:
            correctAnswer = question["answer"]
            question["_id"] = str(question["_id"])
            questions.append(question)
            if userAnswer.strip().lower() == correctAnswer.strip().lower():
                score += 1

    return {"score": score, "questions": questions}


def get10AptitudeTests():
    tests = []
    for _ in range(10):
        test = getAptitudeQuestions()
        tests.append(test)
    return tests


def saveSet(set):
    db.sets.insert_one(set)
    set["_id"] = str(set["_id"])
    return set


def getSet(id):
    id = ObjectId(id)
    set = db.sets.find_one({"_id": id})
    questions = []
    if set:
        set["_id"] = str(set["_id"])
        for qid in set["questions"]:
            question = db.questions.find_one({"id": qid})
            if question:
                question["_id"] = str(question["_id"])
                question.pop("answer", None)
                question.pop("explanation", None)
                questions.append(question)
        set["questions"] = questions
    else:
        return None
    return set


def saveResult(setId, userId, userAnswers):
    if not setId or not userId or not userAnswers:
        return None
    result = {
        "setId": setId,
        "userId": userId,
        "userAnswers": userAnswers,
        "dateTaken": datetime.datetime.utcnow(),
    }
    db.results.insert_one(result)
    result["_id"] = str(result["_id"])
    return result


def getResults(userId, page=1, limit=10):
    page = int(page)
    limit = int(limit)
    results = (
        db.results.find({"userId": userId})
        .sort("dateTaken", -1)
        .skip((page - 1) * limit)
        .limit(limit)
    )
    totalResults = db.results.count_documents({"userId": userId})
    totalPages = (totalResults + limit - 1) // limit
    resultsList = []
    for result in results:
        categoryCounts = {"numerical": 0, "verbal": 0, "reasoning": 0, "advanced": 0}
        result["_id"] = str(result["_id"])
        res = getResult(result["userAnswers"])
        result["questions"] = res["questions"]
        result["score"] = res["score"]
        for q in result["questions"]:
            categoryCounts[q["category"]] += 1
        result["category"] = categoryCounts
        resultsList.append(result)
    return resultsList, totalPages, totalResults


def getResultById(userId, resultId):
    if not userId or not resultId:
        return None
    resultId = ObjectId(resultId)
    result = db.results.find_one({"_id": resultId, "userId": userId})
    categoryCounts = {"numerical": 0, "verbal": 0, "reasoning": 0, "advanced": 0}
    if result:
        res = getResult(result["userAnswers"])
        result["questions"] = res["questions"]
        result["score"] = res["score"]
        result["_id"] = str(result["_id"])
        for q in result["questions"]:
            categoryCounts[q["category"]] += 1
        result["category"] = categoryCounts
    return result
