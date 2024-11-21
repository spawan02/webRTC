package rooms

import (
	"context"
	"os"

	livekit "github.com/livekit/protocol/livekit"
	lksdk "github.com/livekit/server-sdk-go/v2"
)

type Room struct {
	Name          string `json:"name"`
	Creation_time string `json:"created-at"`
}

func CreateRoom(param string) {
	// query := r.URL.Query()
	// param := query.Get("roomId")

	host := "http://localhost:7880"
	apiKey := os.Getenv("LIVEKIT_API_KEY")
	apiSecret := os.Getenv("LIVEKIT_API_SECRET")
	roomClient := lksdk.NewRoomServiceClient(host, apiKey, apiSecret)
	room, _ := roomClient.CreateRoom(context.Background(), &livekit.CreateRoomRequest{
		Name:            param,
		EmptyTimeout:    10 * 60, // 10 minutes
		MaxParticipants: 200,
	})
	mp := make(map[string]interface{})
	mp["room"] = room

	// jsonD, _ := json.Marshal(mp)

	// name := mp["name"].(string)

	// w.Write(jsonD["room"])
	// rooms, _ := roomClient.ListRooms(context.Background(), &livekit.ListRoomsRequest{})
	// log.Println(rooms)
	// err := json.Unmarshal(rooms, &room)
	// if err != nil {
	// 	return
	// }
	// w.Write([]byte(room.Name))

}
