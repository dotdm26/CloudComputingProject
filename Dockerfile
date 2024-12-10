# Use a lightweight Python image as the base
FROM python:3.11-slim-buster

# Set the working directory in the container
WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# Copy the application code
COPY app.py ./

# Expose a port 
EXPOSE 8080

# Command to run when the container starts
CMD ["python", "app.py"] 
