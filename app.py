# app.py
from flask import Flask, render_template, request, jsonify
from geopy.geocoders import Nominatim
import requests
import database

# Initialize the Flask application
app = Flask(__name__)

# Function to get geographic coordinates and address of a location
def get_coordinates(location):
    geolocator = Nominatim(user_agent="weather_app")  # Create a geolocator instance with a user agent
    try:
        location_data = geolocator.geocode(location)  # Fetch location data from Nominatim
        if location_data:  # Check if location data is valid
            return location_data.latitude, location_data.longitude, location_data.address
        return None  # Return None if location data is not found
    except:
        return None  # Return None in case of an error (e.g., network issues)

# Function to fetch weather data using the Open-Meteo API
def get_weather_data(lat, lon):
    # Construct the API URL with the latitude and longitude
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"
    try:
        response = requests.get(url)  # Send a GET request to the API
        return response.json()  # Return the JSON response
    except:
        return None  # Return None in case of an error

# Route for the home page
@app.route('/')
def index():
    return render_template('index.html')  # Render the index.html template

# Route to handle weather data requests
@app.route('/weather', methods=['POST'])
def get_weather():
    # Get the location from the JSON body of the request
    location = request.json.get('location').capitalize()  # Capitalize the location for consistency
    if location:  # Check if a location was provided
        coordinates = get_coordinates(location)  # Fetch the coordinates of the location
        if coordinates:  # If coordinates are found
            lat, lon, address = coordinates
            weather_data = get_weather_data(lat, lon)  # Fetch weather data for the coordinates
            if weather_data:  # If weather data is successfully retrieved
                # Save the searched location in the database
                database.find_location(location, address, lat, lon)
                return jsonify({
                    'success': True,  # Indicate a successful response
                    'location': location,  # Return the location name
                    'address': address,  # Return the formatted address
                    'data': weather_data  # Return the weather data
                })
            return jsonify({'success': False, 'error': 'Could not fetch weather data'})  # Weather data fetch failed
        return jsonify({'success': False, 'error': 'Location not found'})  # Location coordinates not found
    return jsonify({'success': False, 'error': 'Please enter a location'})  # Location not provided

# Route to fetch the latest search results
@app.route('/latest_results', methods=['GET'])
def get_latest_searches():
    return database.show_latest_searches()  # Return the latest search data from the database

# Route to fetch the most searched locations
@app.route('/most_searches', methods=['GET'])
def get_most_searches():
    return database.show_most_searches()  # Return the most searched data from the database

# Main entry point of the application
if __name__ == '__main__':
    app.run(debug=True)  # Run the app in debug mode for development
