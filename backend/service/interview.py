from utils.db import db
from datetime import datetime
import pytz
from bson import ObjectId
from service.job import getSpecificJob


def createInterview(userId, jobId, roundName, resumeId, questionAnswer, skills):
    tz_india = pytz.timezone("Asia/Kolkata")
    interview = {
        "userId": userId,
        "roundName": roundName,
        "jobId": jobId,
        "questions": questionAnswer,
        "skills": skills,
        "status": "Scheduled",
        "resumeId": resumeId,
        "dateCreated": datetime.now(tz_india),  # store date in IST timezone
    }
    res = db.interviews.insert_one(interview)
    interview["_id"] = res.inserted_id
    return interview


def getInterview(userId, page=1, limit=9, status="all"):
    page = int(page)
    limit = int(limit)
    total_interviews = 0
    interview = []
    if status == "done":
        interview = (
            db.interviews.find({"userId": userId, "status": "Done"})
            .sort("dateCreated", -1)
            .skip((page - 1) * limit)
            .limit(limit)
        )
        total_interviews = db.interviews.count_documents(
            {"userId": userId, "status": "Done"}
        )
    elif status == "scheduled":
        interview = (
            db.interviews.find({"userId": userId, "status": "Scheduled"})
            .sort("dateCreated", -1)
            .skip((page - 1) * limit)
            .limit(limit)
        )
        total_interviews = db.interviews.count_documents(
            {"userId": userId, "status": "Scheduled"}
        )
    else:
        interview = (
            db.interviews.find({"userId": userId})
            .sort("dateCreated", -1)
            .skip((page - 1) * limit)
            .limit(limit)
        )
        total_interviews = db.interviews.count_documents({"userId": userId})
    interview=list(interview)  # Convert cursor to list for loop does not work on cursor after it has been iterated once.
    if interview:
        for i in interview:
            i["_id"] = str(i["_id"])
            if "jobId" in i and i["jobId"]:
                job = getSpecificJob(i["jobId"])
                i["title"] = job["title"] if job else "Unknown Job"
                i["jobDescription"] = (
                    job["jobDescription"] if job else "No description available"
                )

    total_pages = (total_interviews + limit - 1) // limit  # Calculate total pages
    return interview, total_pages, total_interviews


def getSpecificInterview(interviewId):
    id = ObjectId(interviewId)
    interview = db.interviews.find_one({"_id": id})
    if "jobId" in interview and interview["jobId"]:
        job = getSpecificJob(interview["jobId"])
        interview["title"] = job["title"] if job else "Unknown Job"
        interview["jobDescription"] = (
            job["jobDescription"] if job else "No description available"
        )
    return interview


def setFeedback(interviewId, feedbackId):
    id = ObjectId(interviewId)
    interview = db.interviews.find_one_and_update(
        {"_id": id}, {"$set": {"feedbackId": feedbackId, "status": "Done"}}
    )
    return interview
