import openmeteo_requests
import requests_cache
from retry_requests import retry
import pandas as pd
from datetime import datetime, timezone

def fetch_weather(latitude: float, longitude: float):
    cache_session = requests_cache.CachedSession(".cache", expire_after=3600)
    retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
    client = openmeteo_requests.Client(session=retry_session)

    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "hourly": [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "precipitation_probability",
            "rain",
            "wind_speed_10m",
            "weather_code",
            "visibility",
        ],
        "timezone": "UTC"
    }

    responses = client.weather_api(url, params=params)
    response = responses[0]

    hourly = response.Hourly()

    times = pd.date_range(
        start=pd.to_datetime(hourly.Time(), unit="s", utc=True),
        end=pd.to_datetime(hourly.TimeEnd(), unit="s", utc=True),
        freq=pd.Timedelta(seconds=hourly.Interval()),
        inclusive="left",
    )

    now = datetime.now(timezone.utc)

    # pega o índice da hora mais próxima
    index = min(range(len(times)), key=lambda i: abs(times[i] - now))

    return {
        "timestamp": times[index].isoformat(),
        "temperature": float(hourly.Variables(0).ValuesAsNumpy()[index]),
        "humidity": float(hourly.Variables(1).ValuesAsNumpy()[index]),
        "apparent_temperature": float(hourly.Variables(2).ValuesAsNumpy()[index]),
        "precipitation_probability": float(hourly.Variables(3).ValuesAsNumpy()[index]),
        "rain": float(hourly.Variables(4).ValuesAsNumpy()[index]),
        "wind_speed": float(hourly.Variables(5).ValuesAsNumpy()[index]),
        "weather_code": int(hourly.Variables(6).ValuesAsNumpy()[index]),
        "visibility": float(hourly.Variables(7).ValuesAsNumpy()[index]),
    }
