def normalize_weather(raw, location):
    return {
        "locationId": location["_id"],
        "location": {
            "name": location["city"],
            "latitude": location["latitude"],
            "longitude": location["longitude"],
        },
        "collected_at": raw["timestamp"],
        "metrics": {
            "temperature": raw["temperature"],
            "apparent_temperature": raw["apparent_temperature"],
            "humidity": raw["humidity"],
            "wind_speed": raw["wind_speed"],
            "rain": raw["rain"],
            "precipitation_probability": raw["precipitation_probability"],
            "visibility": raw["visibility"],
        },
        "weather_code": raw["weather_code"],
        "source": "open-meteo"
    }
