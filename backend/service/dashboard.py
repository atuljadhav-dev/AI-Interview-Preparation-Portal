from utils.db import db


def getDashboardData(userId):
    totalResumes = db.resumes.count_documents({"userId": userId})
    totalInterviews = db.interviews.count_documents({"userId": userId})
    totalATSReports = db.atsReports.count_documents({"userId": userId})
    totalFeedbacks = db.feedbacks.count_documents({"userId": userId})
    scheduledInterviews = db.interviews.count_documents(
        {"userId": userId, "status": "Scheduled"}
    )
    avgFeedbackRating = 0
    feedbacks = db.feedbacks.find({"userId": userId}).sort("dateCreated", -1)
    ratings = []
    feedbackCount = 0
    for feedback in feedbacks:
        score = feedback["feedback"]["evaluation"]["score"]
        avgFeedbackRating += score
        ratings.append(score)
        feedbackCount += 1
    ratings.reverse()
    if feedbackCount > 0:
        avgFeedbackRating /= feedbackCount
    avgFeedbackRating = round(avgFeedbackRating, 2)
    skillsRating = {}
    feedbacks = db.feedbacks.find({"userId": userId})
    for feedback in feedbacks:
        if "skillsRating" in feedback["feedback"]:
            for skill in feedback["feedback"]["skillsRating"]:
                if "skillName" in skill and "rating" in skill:
                    skillName = skill["skillName"]
                    rating = skill["rating"]
                    if skillName in skillsRating:
                        skillsRating[skillName]["totalRating"] += rating
                        skillsRating[skillName]["count"] += 1
                    else:
                        skillsRating[skillName] = {"totalRating": rating, "count": 1}
    for skillName in skillsRating:
        skillsRating[skillName] = round(
            skillsRating[skillName]["totalRating"] / skillsRating[skillName]["count"], 2
        )

    return {
        "totalResumes": totalResumes,
        "totalInterviews": totalInterviews,
        "totalATSReports": totalATSReports,
        "totalFeedbacks": totalFeedbacks,
        "scheduledInterviews": scheduledInterviews,
        "avgFeedbackRating": avgFeedbackRating,
        "skillsRating": skillsRating,
        "ratings": ratings,
    }
