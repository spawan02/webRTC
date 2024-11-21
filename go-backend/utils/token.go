package utils

import (
	"log"
	"os"
	"time"

	"github.com/livekit/protocol/auth"
)

func GetJoinToken(room, identity string) string {
	log.Println(string("here inside token"))
	canSubscribe := true
	canPublishData := true
	token := os.Getenv("LIVEKIT_API_KEY")
	secret := os.Getenv("LIVEKIT_API_SECRET")
	at := auth.NewAccessToken(token, secret)

	grant := &auth.VideoGrant{
		RoomJoin:     true,
		Room:         room,
		RoomCreate:   true,
		CanPublish:   &canPublishData,
		CanSubscribe: &canSubscribe,
	}
	log.Println(grant.Room)
	at.AddGrant(grant).
		SetIdentity(identity).
		SetValidFor(time.Hour)

	token, err := at.ToJWT()

	if err != nil {
		log.Printf("Error generating token %v", err)
		return ""
	}
	return token
}
