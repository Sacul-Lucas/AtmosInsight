package main

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"
)

func sendToAPI(msg WeatherMessage) error {
	payload := map[string]interface{}{
		"locationId":      msg.LocationID,
		"temperature":     msg.Metrics.Temperature,
		"humidity":        msg.Metrics.Humidity,
		"windSpeed":       msg.Metrics.WindSpeed,
		"condition":       msg.WeatherCode,
		"rainProbability": msg.Metrics.PrecipitationProbability,
		"timestamp":       msg.CollectedAt,
	}

	body, _ := json.Marshal(payload)

	api := os.Getenv("API_URL")

	if os.Getenv("API_URL") == "" {
		log.Fatal("API_URL not found")
	}

	req, err := http.NewRequest(
		"POST",
		api,
		bytes.NewBuffer(body),
	)

	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+os.Getenv("WORKER_TOKEN"))
	req.Header.Set("X-Worker-Source", "weather-worker")
	req.Header.Set("X-Request-Origin", "rabbitmq")

	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return err
	}

	return nil
}
