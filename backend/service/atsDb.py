from utils.db import db
import hashlib
from datetime import datetime
import pytz
import re
from bson import ObjectId


def saveATSReport(userId, resumeId, jobDescription, atsReport):
    jobDescription = normalize_jd(jobDescription)
    jobhash = hashlib.sha256(jobDescription.strip().encode("utf-8")).hexdigest()
    tz_india = pytz.timezone("Asia/Kolkata")
    atsReportData = {
        "userId": userId,
        "resumeId": resumeId,
        "jobDescription": jobDescription,
        "atsReport": atsReport,
        "jobHash": jobhash,
        "dateCreated": datetime.now(tz_india),  # store date in IST timezone
    }
    res = db.atsReports.insert_one(atsReportData)
    atsReportData["_id"] = str(res.inserted_id)
    return atsReportData


def getATSReport(userId, resumeId, jobDescription):
    jobDescription = normalize_jd(jobDescription)
    jobhash = hashlib.sha256(jobDescription.strip().encode("utf-8")).hexdigest()
    atsReport = db.atsReports.find_one(
        {"userId": userId, "resumeId": resumeId, "jobHash": jobhash}
    )
    if atsReport:
        atsReport["_id"] = str(atsReport["_id"])
    return atsReport


def getATSReportById(userId,reportId):
    reportId = ObjectId(reportId)
    atsReport = db.atsReports.find_one({"_id": reportId, "userId": userId})
    if atsReport:
        atsReport["_id"] = str(atsReport["_id"])
    return atsReport


def getAllATSReports(userId, page=1, limit=9):
    page = int(page)
    limit = int(limit)
    atsReports = (
        db.atsReports.find({"userId": userId})
        .sort("dateCreated", -1)
        .skip((page - 1) * limit)
        .limit(limit)
    )
    total_reports = db.atsReports.count_documents({"userId": userId})
    total_pages = (total_reports + limit - 1) // limit  # Calculate total pages
    reports_list = []
    for report in atsReports:
        report["_id"] = str(report["_id"])
        reports_list.append(report)
    return {"reports": reports_list, "totalPages": total_pages}


def getATSReportByResumeId(userId, resumeId):
    atsReports = db.atsReports.find({"userId": userId, "resumeId": resumeId}).sort(
        "dateCreated", -1
    )
    reports_list = []
    for report in atsReports:
        report["_id"] = str(report["_id"])
        reports_list.append(report)
    return reports_list


def normalize_jd(jd: str):
    jd = jd.lower()
    jd = jd.strip()
    jd = re.sub(r"\s+", " ", jd)  # collapse multiple spaces
    return jd
