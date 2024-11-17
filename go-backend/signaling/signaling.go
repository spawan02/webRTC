package signaling

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var (
	senderSocket   *websocket.Conn
	receiverSocket *websocket.Conn
	upgrader       = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
)

func HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		log.Println("Error connecting to the websocket")
	}
	defer ws.Close()

	log.Println("Websocket connected")
	if err != nil {
		log.Println("Error creating peerconnection", err)
		return
	}

	for {
		var message map[string]interface{}
		err := ws.ReadJSON(&message)
		if err != nil {
			log.Println("Error reading message")
			break
		}
		messageType := message["type"].(string)
		switch messageType {
		case "sender":
			senderSocket = ws
		case "receiver":
			receiverSocket = ws

		case "createOffer":
			if receiverSocket != nil {
				receiverSocket.WriteJSON(message)
			}
		case "createAnswer":
			if senderSocket != nil {
				senderSocket.WriteJSON(message)
			}
		case "iceCandidate":
			if ws == senderSocket && receiverSocket != nil {
				receiverSocket.WriteJSON(message)
			} else if ws == receiverSocket && senderSocket != nil {
				senderSocket.WriteJSON(message)
			}
		}
	}
}
