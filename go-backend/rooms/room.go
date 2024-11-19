// package rooms

// import (
// 	"context"
// 	"encoding/json"
// 	"log"
// 	"net/http"
// 	"os"

// 	livekit "github.com/livekit/protocol/livekit"
// 	lksdk "github.com/livekit/server-sdk-go/v2"
// )

// type Room struct {
// 	Name          string `json:"name"`
// 	Creation_time string `json:"created-at"`
// }

// func CreateRoom(w http.ResponseWriter, r *http.Request) {
// 	host := "http://localhost:7880"
// 	apiKey := os.Getenv("LIVEKIT_API_KEY")
// 	apiSecret := os.Getenv("LIVEKIT_API_SECRET")
// 	roomClient := lksdk.NewRoomServiceClient(host, apiKey, apiSecret)
// 	room, _ := roomClient.CreateRoom(context.Background(), &livekit.CreateRoomRequest{
// 		Name:            "myroom",
// 		EmptyTimeout:    10 * 60, // 10 minutes
// 		MaxParticipants: 20,
// 	})

// 	log.Printf(room.Name)
// 	rooms, _ := roomClient.ListRooms(context.Background(), &livekit.ListRoomsRequest{})
// 	log.Println(rooms)
// 	err := json.Unmarshal(rooms, &room)
// 	if err != nil {
// 		return
// 	}
// 	w.Write([]byte(room.Name))

// }
