package utils

import (
	"crypto/rand"
	"math/big"
)

func GenerateRandomString() string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	length := 5
	result := make([]byte, length)

	for i := range result {

		idx, err := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		if err != nil {
			return ""
		}
		result[i] = charset[idx.Int64()]
	}
	return string(result)
}
