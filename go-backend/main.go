package main

import (
	"encoding/json"
	"log"
	"net/http"

	// "webrtc/rooms"
	"webrtc/signaling"
	"webrtc/utils"
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
	// http.HandleFunc("/room", rooms.CreateRoom)
	log.Println("Websocket running")
	http.HandleFunc("/token", func(w http.ResponseWriter, r *http.Request) {

		enableCors(w)
		query := r.URL.Query()
		param := query.Get("userId")

		message := make(map[string]interface{})
		log.Println(string(param))
		token := utils.GetJoinToken("my-room", param)
		message["token"] = token
		jsonData, _ := json.Marshal(message)

		w.Write(jsonData)
	})
	log.Fatal(http.ListenAndServe(":8080", nil))
}
