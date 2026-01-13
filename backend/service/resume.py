from utils.db import db
from bson import ObjectId
def getResume(userId):
    user=db.resumes.find({"userId":userId})
    return user
def createResume(userId, resume,name,url=None,publicId=None):
    resume={
        "userId":userId,
        "resume":resume,
        "name":name,
        "url":url,
        "publicId":publicId
        }
    res=db.resumes.insert_one(resume)
    resume["_id"] = res.inserted_id
    return resume

def deleteResume(userId,resumeId):
    id=ObjectId(resumeId)
    res=db.resumes.find_one_and_delete({"_id":id,"userId":userId})
    return res

def checkExistResume(name):
    res=db.resumes.find_one({"name":name})
    if res:
        return True
    return False