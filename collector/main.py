import time
from locationsClient import fetch_locations
from openMeteo import fetch_weather
from publisher import publish
from normalize import normalize_weather
from config import COLLECTION_INTERVAL_SECONDS

def main():
    while True:
        try:
            locations = fetch_locations()
            print(f"Found {len(locations)} locations")

            for location in locations:
                try:
                    raw = fetch_weather(
                        location["latitude"],
                        location["longitude"]
                    )
                    payload = normalize_weather(raw, location)
                    publish(payload)
                    print(f"Published weather for {location['name']}")
                except Exception as e:
                    print(f"Error processing location {location['name']}: {e}")

        except Exception as e:
            print("Error fetching locations:", e)

        time.sleep(COLLECTION_INTERVAL_SECONDS)

if __name__ == "__main__":
    main()
