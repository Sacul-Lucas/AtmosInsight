package main

func (m WeatherMessage) IsValid() bool {
	if m.UserID == "" || m.LocationID == "" {
		return false
	}

	if m.Weather.Temperature < -50 || m.Weather.Temperature > 60 {
		return false
	}

	if m.Weather.Humidity < 0 || m.Weather.Humidity > 100 {
		return false
	}

	return true
}
