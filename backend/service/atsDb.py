from utils.db import db
from datetime import datetime
import pytz
from bson import ObjectId
from service.job import getSpecificJob


def saveATSReport(userId, resumeId, jobId, atsReport):
    tzIndia = pytz.timezone("Asia/Kolkata")
    atsReportData = {
        "userId": userId,
        "resumeId": resumeId,
        "atsReport": atsReport,
        "jobId": jobId,
        "dateCreated": datetime.now(tzIndia),  # store date in IST timezone
    }
    res = db.atsReports.insert_one(atsReportData)
    atsReportData["_id"] = str(res.inserted_id)
    return atsReportData


def getATSReport(userId, resumeId, jobId):
    atsReport = db.atsReports.find_one(
        {"userId": userId, "resumeId": resumeId, "jobId": jobId}
    )
    if atsReport:
        atsReport["_id"] = str(atsReport["_id"])
    return atsReport


def getATSReportById(userId, reportId):
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
    totalReports = db.atsReports.count_documents({"userId": userId})
    totalPages = (totalReports + limit - 1) // limit  # Calculate total pages
    reportsList = []
    for report in atsReports:
        report["_id"] = str(report["_id"])
        if "jobId" in report and report["jobId"]:
            job = getSpecificJob(report["jobId"])
            if job:
                report["title"] = job["title"]
                report["jobDescription"] = job["jobDescription"]
        reportsList.append(report)
    return {"reports": reportsList, "totalPages": totalPages}


def getATSReportByResumeId(userId, resumeId):
    atsReports = db.atsReports.find({"userId": userId, "resumeId": resumeId}).sort(
        "dateCreated", -1
    )
    reportsList = []
    for report in atsReports:
        report["_id"] = str(report["_id"])
        reportsList.append(report)
    return reportsList
