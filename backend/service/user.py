from utils.db import db
from datetime import datetime
import bcrypt
from bson import ObjectId
def createUser(name,email,password):
    passwordBytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashpass = bcrypt.hashpw(passwordBytes, salt).decode('utf-8')
    createdAt=datetime.now()
    user={
        "name":name,
        "email":email,
        "password":hashpass,
        "createdAt":createdAt
        }
    res=db.users.insert_one(user)
    user["_id"] = res.inserted_id
    return user

def FindUserByEmail(email):
    res=db.users.find_one({"email":email})
    return res

def Login(email,password):
    res=db.users.find_one({"email":email})
    if not res:
        return None
    loginPasswordBytes = password.encode('utf-8')
    storedPassword=res['password'].encode('utf-8')
    isMatch = bcrypt.checkpw(loginPasswordBytes, storedPassword)
    if isMatch:
        return res
    return None
def FindUserById(userId):
    try:
        userObjId = ObjectId(userId)
        res = db.users.find_one({"_id": userObjId})
        res['_id']=str(res['_id'])
        return res
    except Exception as e:
        return None
