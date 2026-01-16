import os
from dotenv import load_dotenv

load_dotenv()

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")
QUEUE_NAME = os.getenv("QUEUE_NAME", "weather.logs")

API_BASE_URL = os.getenv("API_BASE_URL", "http://api:1500")

LOCATIONS_ENDPOINT = os.getenv("LOCATIONS_ENDPOINT", "/api/locations/active")

COLLECTION_INTERVAL_SECONDS = int(
    os.getenv("COLLECTION_INTERVAL_SECONDS", "3600")
)

DEFAULT_LOOKBACK_HOURS = int(os.getenv("DEFAULT_LOOKBACK_HOURS", "6"))
DEFAULT_FORECAST_HOURS = int(os.getenv("DEFAULT_FORECAST_HOURS", "24"))