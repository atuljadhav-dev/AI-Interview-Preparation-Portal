from utils.db import db
def createConversation(conversations,userId,interviewId):
    conversation={
        "userId":userId,
        "interviewId":interviewId,
        "conversations":conversations
        }
    res=db.conversations.insert_one(conversation)
    conversation["_id"] = str(res.inserted_id)
    return conversation
def getConversation(userId, interviewId):
    print(userId, interviewId)
    conversation = db.conversations.find_one({
        "userId": userId,
        "interviewId": interviewId
    })

    if not conversation:
        return None  # return None if no record found

    # Convert ObjectId to string
    conversation["_id"] = str(conversation["_id"])
    print(conversation)
    return conversation
    