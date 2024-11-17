package main

import (
	"log"
	"net/http"
	"pion-webrtc/signaling"
)

func main() {
	http.HandleFunc("/", signaling.HandleWebSocket)
	log.Println("Websocket is running on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("error starting server", err)
	}
}
