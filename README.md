Setup:

* Check the prerequisites for libraries:
- Steps
1. Clone the repository:
   * `git clone <repository-url>`
   * `cd <repository-folder>`
2. Install dependencies:
   * `python -m pip install -r requirements.txt`
3. Create a .env file with the following variables:
   * `SECRET_KEY=<your-secret-key>`
   * `MONGO_URI=<your-mongodb-uri>`
4. Run the Flask application:
   * `python app.py`
5. Access the application: 
   *  http://127.0.0.1:5000


Group - 5

- Minh  Do - 240422611
- Sabbir - 230673537
- Rohan Naveen - 240151478
- Justin

Overview:

The Live Weather and Forecast Application is a Flask-based web application designed to support real-time weather information with built-in search analytics. The user can input a location to pull data on that area's current weather. It also monitors search trends and displays recent and popular searches.

Features
* Real-time weather data retrieval using the Open-Meteo API.
* Geocoding user input using Geopy to fetch latitude and longitude.
* Database integration with MongoDB for:
    * Tracking search history.
    * Identifying popular searches.
* RESTful API endpoints for user interaction.
* Scalable backend architecture for future enhancements.


Technologies Used: 
- Frontend (templates > index.html)
    * HTML, CSS
- Backend (app.py)
    * Flask (Python)
- Database (database.py)
    * MongoDB (via Flask-PyMongo)
- APIs
    * Geopy: For geocoding user input.
    * Open-Meteo API: For retrieving weather data.
- Development Tools
    * Python-dotenv: For environment variable management.
    * Requests: For making API calls.

API Endpoints:
* GET /: Renders the homepage.
* POST /weather:
    * Input: Location (e.g., city name).
    * Output: Weather details (temperature, humidity, etc.).
* GET /popular-searches: Returns the top 5 most searched locations.
* GET /recent-searches: Returns the 5 most recent searches

Future Enhancements:
- Deploy the application on a cloud platform (e.g., GCP, AWS, Heroku).
- Implement load balancing and autoscaling for high traffic.
- Enhance the UI with a responsive design.

Challenges and Solutions: 
1) Handling API Rate Limits:
- Used caching mechanisms for commonly searched locations.
2) Database Management:
- Optimized MongoDB queries for faster analytics.

