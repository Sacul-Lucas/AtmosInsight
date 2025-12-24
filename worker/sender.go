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
		"userId":          msg.UserID,
		"locationId":      msg.LocationID,
		"temperature":     msg.Weather.Temperature,
		"humidity":        msg.Weather.Humidity,
		"windSpeed":       msg.Weather.WindSpeed,
		"condition":       msg.Weather.Condition,
		"rainProbability": msg.Weather.RainProbability,
		"timestamp":       msg.Timestamp,
	}

	body, _ := json.Marshal(payload)

	api := os.Getenv("API_URL")

	if os.Getenv("API_URL") == "" {
		log.Fatal("Url da API não encontrado")
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
