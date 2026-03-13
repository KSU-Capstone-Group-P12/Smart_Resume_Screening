# Connects the backend to MongoDB and exposes the collections used by the app.
import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

#mongo connection url is in .env use the example to set up with your own Atlas
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)

db = client["smart_resume"]
#More to follow as development continues.
resumes_collection = db["resumes"]
candidates_collection = db["candidates"]