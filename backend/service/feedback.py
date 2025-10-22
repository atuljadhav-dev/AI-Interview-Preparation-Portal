from utils.db import db
from routes.auth import verify_jwt
from service.interview import getInterview
def addFeedback(interviewId, feedback):
    result = db.feedbacks.insert_one({
        "feedback": feedback,
        "interviewId": interviewId
    })
    return {
        "_id": str(result.inserted_id),
        "feedback": feedback,
        "interviewId": interviewId
    }

def getFeedBack(interviewId):
    res = db.feedbacks.find_one({"interviewId": interviewId})
    if not res:
        return None
    res["_id"] = str(res["_id"])
    return res

def allFeedBack(request):
    data=verify_jwt(request)
    if not data:
        return None
    try:
        interviews=getInterview(data["userId"])
        feedback_list = []
        for interview in interviews:
            if "feedbackId" in interview:
                interview["_id"]=str(interview["_id"])
                feedback=db.feedbacks.find_one({"interviewId": interview["_id"]})
                feedback["_id"] = str(feedback["_id"])
                feedback["interview"]=interview
            feedback_list.append(feedback)
        
        return feedback_list
    except Exception as e:
        return e