package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"sync"
	"webrtc/rooms"
	"webrtc/signaling"
	"webrtc/utils"
)

var (
	// Global map to store room data, protected by a mutex for thread-safety
	existingRoom = make(map[string]interface{})
	mu           sync.Mutex
)

func enableCors(w http.ResponseWriter) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, role, admin,user")
	// w.Header().Set("Access-Control-Allow-Headers", "role, admin,user")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
}

func main() {
	http.HandleFunc("/", signaling.HandleWebSocket)
	log.Println("Websocket running")

	http.HandleFunc("/doc", func(w http.ResponseWriter, r *http.Request) {
		enableCors(w)
		err := utils.GetPdf()
		if err != nil {
			fmt.Println("error")
		}
		w.Header().Set("Content-Type", "application/pdf")
		// w.Header().Set("Content-Disposition", "attachment; filename=demo.pdf")
		w.WriteHeader(http.StatusOK)
		file, _ := os.Open("./demo.pdf")
		_, err = io.Copy(w, file)
		if err != nil {
			http.Error(w, "error sending the file", http.StatusInternalServerError)
		}

	})

	http.HandleFunc("/token", func(w http.ResponseWriter, r *http.Request) {
		enableCors(w)
		query := r.URL.Query()
		param := query.Get("userId")
		// roomParam := query.Get("roomId")
		role := r.Header.Get("role")
		randRoomId := ""
		if role == "admin" {
			randRoomId = utils.GenerateRandomString()
			log.Println(randRoomId)
			rooms.CreateRoom(randRoomId)
			mu.Lock()
			existingRoom["admin"] = randRoomId
			mu.Unlock()
			log.Printf("this is %v", existingRoom)
		}

		log.Printf("this is in room %v", existingRoom)
		message := make(map[string]interface{})
		value, exists := existingRoom["admin"]
		if !exists || value == nil {
			fmt.Println("value is nill")
			return
		}

		if admin, ok := value.(string); ok {
			if len(admin) == 0 {
				response := "Waiting for the host to join"
				w.Write([]byte(response))
				fmt.Println(response)
				return
			}
			token := utils.GetJoinToken(admin, param)
			message["token"] = token
			jsonData, _ := json.Marshal(message)

			w.Write(jsonData)

		}

	})
	// http.HandleFunc("/list", func(w http.ResponseWriter, r *http.Request) {
	// 	host := "http://localhost:7880"
	// 	apiKey := os.Getenv("LIVEKIT_API_KEY")
	// 	apiSecret := os.Getenv("LIVEKIT_API_SECRET")
	// 	roomClient := lksdk.NewRoomServiceClient(host, apiKey, apiSecret)

	// 	rooms, _ := roomClient.ListRooms(context.Background(), &livekit.ListRoomsRequest{})
	// 	log.Println(rooms)
	// 	err := json.Unmarshal(rooms, &room)
	// 	if err != nil {
	// 		return
	// 	}
	// 	w.Write([]byte(room.Name))
	// })
	log.Fatal(http.ListenAndServe(":8080", nil))
}
