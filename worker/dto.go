package main

import "time"

type WeatherMessage struct {
	LocationID  string    `json:"locationId"`
	CollectedAt time.Time `json:"collected_at"`
	Metrics     Metrics   `json:"metrics"`
	Type        string    `json:"type"`
	WeatherCode int       `json:"weather_code"`
	Source      string    `json:"source"`
}

type Metrics struct {
	Temperature              float64 `json:"temperature"`
	ApparentTemperature      float64 `json:"apparent_temperature"`
	Humidity                 float64 `json:"humidity"`
	WindSpeed                float64 `json:"wind_speed"`
	Rain                     float64 `json:"rain"`
	PrecipitationProbability float64 `json:"precipitation_probability"`
	Visibility               float64 `json:"visibility"`
}
