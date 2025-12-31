from config import API_BASE_URL, LOCATIONS_ENDPOINT
import requests
import time
import requests

def fetch_locations(retries=5, delay=3):
    for attempt in range(retries):
        try:
            response = requests.get(
                f"{API_BASE_URL}{LOCATIONS_ENDPOINT}",
                timeout=10
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.ConnectionError:
            print(f"Backend not ready, retrying ({attempt + 1}/{retries})...")
            time.sleep(delay)

    raise RuntimeError("Backend not available after retries")