package main

import (
	"log"
	"os"
)

func main() {
	if os.Getenv("WORKER_TOKEN") == "" {
		log.Fatal("WORKER_TOKEN não definido")
	}

	startConsumer()
}

// go run .
// go build -o worker
// ./worker
