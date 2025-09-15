# Robodog Live GPS Tracker

This is a Flask web application that simulates a live GPS tracker for a surveillance robot.

The application has three main components:

- MQTT Client: Subscribes to an MQTT topic to receive GPS coordinates.

- Mock Data Publisher: A background thread that simulates the robodog's movement and publishes mock GPS data to the MQTT topic. 

- Flask Web Server: Serves a web page with a live map that visualizes the robodog's path and displays its current coordinates and camera feed.

## How to Run

Ensure you have Python and uv installed.

Run the application: uv run main.py

The application will be accessible at http://127.0.0.1:5000/

<img width="1034" height="915" alt="image" src="https://github.com/user-attachments/assets/029f36ad-b91e-4193-821c-e47d9f072e05" />
