import requests
from config import API_BASE_URL, LOCATIONS_ENDPOINT

def fetch_locations():
    response = requests.get(f"{API_BASE_URL}{LOCATIONS_ENDPOINT}", timeout=10)
    response.raise_for_status()
    return response.json()