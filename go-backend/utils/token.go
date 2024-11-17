package utils

import (
	"log"
	"os"
	"time"

	"github.com/livekit/protocol/auth"
)

func GetJoinToken(room, identity string) string {
	at := auth.NewAccessToken(os.Getenv("LIVEKIT_API_KEY"), os.Getenv("LIVEKIT_API_SECRET"))
	grant := &auth.VideoGrant{
		RoomJoin: true,
		Room:     room,
	}
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
