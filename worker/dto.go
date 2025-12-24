package main

import "time"

type WeatherMessage struct {
	UserID     string    `json:"userId"`
	LocationID string    `json:"locationId"`
	Weather    Weather   `json:"weather"`
	Timestamp  time.Time `json:"timestamp"`
}

type Weather struct {
	Temperature     float64 `json:"temperature"`
	Humidity        int     `json:"humidity"`
	WindSpeed       float64 `json:"windSpeed"`
	Condition       string  `json:"condition"`
	RainProbability float64 `json:"rainProbability"`
}
