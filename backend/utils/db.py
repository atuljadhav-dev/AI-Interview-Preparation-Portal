from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
URI = os.getenv("MONGODB_URI")
if not URI:
    raise ValueError("Database URI is Missing!")
client = MongoClient(URI)
db = client["AIInterview"]

# Create indexes for efficient querying
db.users.create_index("email", unique=True)

db.resumes.create_index("userId")

db.jobs.create_index([("userId", 1), ("jobHash", 1)], unique=True)

db.interviews.create_index([("userId", 1), ("status", 1), ("dateCreated", -1)])

db.feedbacks.create_index("userId")
db.feedbacks.create_index("interviewId")
