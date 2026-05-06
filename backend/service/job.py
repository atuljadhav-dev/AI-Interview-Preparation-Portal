from utils.db import db
from bson import ObjectId
from datetime import datetime
import pytz
from utils.normalizeText import makeHash, normalizeText
from service.atsMain import detectAllSkills


def saveJob(userId, title, jobDescription):
    tzIndia = pytz.timezone("Asia/Kolkata")
    normalizedDescription = normalizeText(jobDescription)
    jobHash = makeHash(
        normalizedDescription
    )  # Generate hash for the normalized job description
    skills = detectAllSkills(jobDescription)
    job = {
        "userId": userId,
        "title": title,
        "jobDescription": jobDescription,
        "jobHash": jobHash,
        "skills": list(skills),
        "dateCreated": datetime.now(tzIndia),  # store date in IST timezone
    }
    res = db.jobs.insert_one(job)
    job["_id"] = res.inserted_id
    return job


def getJobs(userId, page=1, limit=9):
    page = int(page)
    limit = int(limit)
    totalJobs = db.jobs.count_documents({"userId": userId})
    jobs = (
        db.jobs.find({"userId": userId})
        .sort("dateCreated", -1)
        .skip((page - 1) * limit)
        .limit(limit)
    )
    totalPages = (totalJobs + limit - 1) // limit  # Calculate total pages
    return list(jobs), totalPages, totalJobs


def getSpecificJob(jobId):
    id = ObjectId(jobId)
    job = db.jobs.find_one({"_id": id})
    return job


def getJobByHash(jobDescription):
    normalizedDescription = normalizeText(jobDescription)
    jobHash = makeHash(normalizedDescription)
    job = db.jobs.find_one({"jobHash": jobHash})
    return job
