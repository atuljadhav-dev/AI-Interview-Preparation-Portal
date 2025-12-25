from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
URI=os.getenv('MONGODB_URI')
if not URI:
    raise ValueError("Database URI is Missing!")
client= MongoClient(URI)
db = client["AIInterview"]
