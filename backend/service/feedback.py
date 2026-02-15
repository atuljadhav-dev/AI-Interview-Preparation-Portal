from utils.db import db
from service.interview import getSpecificInterview
import pytz
import datetime


def addFeedback(interviewId, feedback, userId):
    tz_india = pytz.timezone("Asia/Kolkata")
    result = db.feedbacks.insert_one(
        {
            "feedback": feedback,
            "interviewId": interviewId,
            "userId": userId,
            "dateCreated": datetime.now(tz_india),
        }
    )
    return {
        "_id": str(result.inserted_id),
        "feedback": feedback,
        "interviewId": interviewId,
    }


def getFeedBack(interviewId, userId):
    interview = getSpecificInterview(interviewId)
    if not interview or interview["userId"] != userId:
        return None
    res = db.feedbacks.find_one({"interviewId": interviewId})
    if not res:
        return None
    res["_id"] = str(res["_id"])
    return res


def allFeedBack(userId, page=1, limit=9):
    page = int(page)
    limit = int(limit)
    feedbacks = (
        db.feedbacks.find({"userId": userId})
        .sort("dateCreated", -1)
        .skip((page - 1) * limit)
        .limit(limit)
    )
    total_feedbacks = db.feedbacks.count_documents({"userId": userId})
    total_pages = (total_feedbacks + limit - 1) // limit
    feedbackList = []
    for feedback in feedbacks:
        feedback["_id"] = str(feedback["_id"])
        feedbackList.append(feedback)
    return feedbackList, total_pages, total_feedbacks
