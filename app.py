# app.py
from flask import Flask, render_template, request, jsonify
from geopy.geocoders import Nominatim
import requests
import database

app = Flask(__name__)

def get_coordinates(location):
    geolocator = Nominatim(user_agent="weather_app")
    try:
        location_data = geolocator.geocode(location)
        if location_data:
            return location_data.latitude, location_data.longitude
        return None
    except:
        return None

def get_weather_data(lat, lon):
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"
    try:
        response = requests.get(url)
        return response.json()
    except:
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/weather', methods=['POST'])
def get_weather():
    location = request.json.get('location')
    if location:
        coordinates = get_coordinates(location)
        if coordinates:
            lat, lon = coordinates
            weather_data = get_weather_data(lat, lon)
            if weather_data:
                #locate the searched location in the database
                database.find_location(location, lat, lon)
                return jsonify({
                    'success': True,
                    'location': location,
                    'data': weather_data
                })
            return jsonify({'success': False, 'error': 'Could not fetch weather data'})
        return jsonify({'success': False, 'error': 'Location not found'})
    return jsonify({'success': False, 'error': 'Please enter a location'})

@app.route('/latest_results', methods=['GET'])
def get_latest_searches():
    return database.show_latest_searches()

@app.route('/most_searches', methods=['GET'])
def get_most_searches():
    return database.show_most_searches()

if __name__ == '__main__':
    app.run(debug=True)