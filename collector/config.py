import os
from dotenv import load_dotenv

load_dotenv()

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")
QUEUE_NAME = os.getenv("QUEUE_NAME", "weather_logs")

API_BASE_URL = os.getenv("API_BASE_URL", "http://api:1500")

LOCATIONS_ENDPOINT = "/api/locations/active"

COLLECTION_INTERVAL_SECONDS = int(os.getenv("INTERVAL", "3600"))