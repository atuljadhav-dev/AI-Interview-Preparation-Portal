from utils.db import db
from bson import ObjectId
def getProfile(userId):
    user=db.profiles.find({"userId":userId})
    return user
def createProfile(userId, resume,name,url=None,public_id=None):
    profile={
        "userId":userId,
        "resume":resume,
        "name":name,
        "url":url,
        "public_id":public_id
        }
    res=db.profiles.insert_one(profile)
    profile["_id"] = res.inserted_id
    return profile

def deleteProfile(userId,profileId):
    id=ObjectId(profileId)
    res=db.profiles.find_one_and_delete({"_id":id,"userId":userId})
    return res

def checkExistProfile(name):
    res=db.profiles.find_one({name})
    if res:
        return True
    return False