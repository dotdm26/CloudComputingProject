from flask import jsonify
from dotenv import load_dotenv
from flask_pymongo import PyMongo
import os
from app import app
from datetime import datetime

load_dotenv()

# Setup MongoDB. Keys are stored in an .env file
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["MONGO_URI"] = os.getenv("MONGO_URI")

mongodb_client = PyMongo(app)
db = mongodb_client.cx.get_database('data')

# Access collection named "locations" of the "data" database
locations = db['locations']

#check if city has been searched first, then update time.
#if not, add city to database
def save_location(location):
    result = locations.find_one({"location": location})
    if result:
        print("Found")
        locations.update_one({"location": location},
                             {"$set": {"timestamp": datetime.now()}})
    else:
        print("Creating new")
        locations.insert_one({"location": location,
                              "timestamp": datetime.now()})

def show_latest_searches():
    results = list(locations.find().sort("timestamp", -1).limit(5))
    location_name = [result['location'] for result in results]

    return jsonify({"locations": location_name})