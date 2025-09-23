from utils.db import db
def getProfile(userId):
    user=db.profiles.find_one({"userId":userId})
    return user
def createProfile(userId, resume):
    profile={
        "userId":userId,
        "resume":resume
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