from utils.db import db
from datetime import datetime
from bson import ObjectId
def createInterview(userId,title,round_name,description,question_answer,resumeId):
    interview={
        "userId":userId,
        "title":title,
        "roundName":round_name,
        "jobDescription":description,
        "questions":question_answer,
        "status": "Scheduled",
        "resumeId":resumeId,
        "dateCreated": datetime.utcnow()
        }
    res=db.interviews.insert_one(interview)
    interview["_id"] = res.inserted_id
    return interview
def getInterview(userId):
    interview=db.interviews.find({"userId":userId})
    return interview
def getSpecificInterview(interviewId):
    id=ObjectId(interviewId)
    interview=db.interviews.find_one({"_id":id})
    return interview
def setFeedback(interviewId,feedbackId):
    id=ObjectId(interviewId)
    interview=db.interviews.find_one_and_update({"_id":id},{"$set": {"feedbackId": feedbackId, "status": "Done"}})
    return interview
