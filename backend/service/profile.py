from utils.db import db
from bson import ObjectId
def getProfile(userId):
    user=db.profiles.find({"userId":userId})
    return user
def createProfile(userId, resume,name):
    profile={
        "userId":userId,
        "resume":resume,
        "name":name
        }
    res=db.profiles.insert_one(profile)
    profile["_id"] = res.inserted_id
    return profile
def updateProfile(userId, resume):
    profile={
        "userId":userId,
        "resume":resume
        }
    res=db.profiles.update_one({"userId":userId},{"$set":profile},upsert=True)
    profile["_id"] = res.upserted_id
    return profile

def deleteProfile(userId,profileId):
    id=ObjectId(profileId)
    res=db.profiles.find_one_and_delete({"_id":id,"userId":userId})
    return res