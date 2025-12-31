import time
import traceback
from locationsClient import fetch_locations
from openMeteo import fetch_weather
from publisher import publish
from normalize import normalize_weather
from config import COLLECTION_INTERVAL_SECONDS

print("Collector starting...")
print("Interval:", COLLECTION_INTERVAL_SECONDS)

def main():
    def safe_publish(payload, retries=3):
        for attempt in range(retries):
            try:
                publish(payload)
                print("Locations payload sent:", payload)
                return
            except Exception as e:
                print(f"Publish failed ({attempt+1}/{retries}): {e}")
                time.sleep(2)
        raise

    while True:
        try:
            locations = fetch_locations()
            print(f"Found {len(locations)} locations")
            print("Locations payload example:", locations[0])

            for location in locations:
                try:
                    raw = fetch_weather(
                        location["latitude"],
                        location["longitude"]
                    )
                    payload = normalize_weather(raw, location)
                    safe_publish(payload)
                    print(f"Published weather for {location['city']}")
                except Exception as e:
                    traceback.print_exc()

        except Exception as e:
            traceback.print_exc()

        time.sleep(COLLECTION_INTERVAL_SECONDS)

if __name__ == "__main__":
    main()
