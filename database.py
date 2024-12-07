# database.py

from flask import jsonify
from dotenv import load_dotenv
from flask_pymongo import PyMongo
import os
from app import app
from datetime import datetime

load_dotenv()

# Setup MongoDB. Keys are stored locally in an .env file to avoid unwanted access
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["MONGO_URI"] = os.getenv("MONGO_URI")

mongodb_client = PyMongo(app)
db = mongodb_client.cx.get_database('data')

# Access collection named "locations" of the "data" database
locations = db['locations']
search_history = db['search_history']

#check if city has been searched first, then update time.
#if not, add city to "location" database
def find_location(location, address, lat, lon):
    #find by lat & long
    result = locations.find_one({"address": address})
    if result:
        print("Found location in database")
        locations.update_one({"address": address},
                             {"$inc": {"searches": 1}})
    else:
        print("Adding new location to database")
        locations.insert_one({"address": address,
                              "longitude": lon,
                              "latitude": lat,
                              "searches": 1})
    add_to_history(location.capitalize())
        
#add to "search_history" collection for tracking recent searches.
def add_to_history(location):
    search_history.insert_one({"location": location,
                               "timestamp": datetime.now()})

#display latest search results (retrieve data from "search_history" collection)
def show_latest_searches():
    results = list(search_history.find().sort("timestamp", -1).limit(5))
    search_result = [result['location'] for result in results]

    return jsonify({"locations": search_result})

#display most searched results (in "locations" collection in mongodb)
def show_most_searches():
    results = list(locations.find().sort("searches", -1).limit(5))
    address_name = [result['address'] for result in results]

    return jsonify({"addresses": address_name})