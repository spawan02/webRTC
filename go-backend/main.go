package main

import (
	"encoding/json"
	"log"
	"net/http"
	"pion-webrtc/signaling"
	"pion-webrtc/utils"
)

func enableCors(w http.ResponseWriter) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
}

func main() {

	http.HandleFunc("/", signaling.HandleWebSocket)
	log.Println("Websocket is running on :8080")

	http.HandleFunc("/token", func(w http.ResponseWriter, r *http.Request) {
		enableCors(w)
		message := make(map[string]interface{})
		token := utils.GetJoinToken("my-room", "identity")
		message["token"] = token
		jsonData, _ := json.Marshal(message)

		w.Write(jsonData)
	})
	log.Fatal(http.ListenAndServe(":8080", nil))
}
