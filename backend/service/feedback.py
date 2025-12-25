from utils.db import db
from service.interview import getInterview,getSpecificInterview
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

def getFeedBack(interviewId,userId):
    interview=getSpecificInterview(interviewId)
    if not interview or interview["userId"] != userId:
        return None
    res = db.feedbacks.find_one({"interviewId": interviewId})
    if not res:
        return None
    res["_id"] = str(res["_id"])
    return res

def allFeedBack(userId):
    try:
        interviews=getInterview(userId) or []
        feedback_list = []
        for interview in interviews:
            if "feedbackId" in interview:
                interview["_id"]=str(interview["_id"])
                feedback=db.feedbacks.find_one({"interviewId": interview["_id"]})
                if feedback:
                    feedback["_id"] = str(feedback["_id"])
                    feedback["interview"]=interview
                    feedback_list.append(feedback)
        return feedback_list
    except Exception as e:
        return None