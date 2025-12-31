package main

import (
	"log"
	"os"
)

func main() {
	if os.Getenv("WORKER_TOKEN") == "" {
		log.Fatal("WORKER_TOKEN not defined")
	}

	startConsumer()
}

// go run .
// go build -o worker
// ./worker
