package utils

import (
	"fmt"
	"io"
	"net/http"
	"os"
)

func GetPdf() error {
	url := "https://pawan-app.blr1.cdn.digitaloceanspaces.com/demo.pdf"
	resp, err := http.Get(url)

	if err != nil {
		return fmt.Errorf("error", resp.StatusCode)
	}
	defer resp.Body.Close()

	// Check if the request was successful
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("error", resp.StatusCode)
	}

	outFile, err := os.Create("demo.pdf")
	if err != nil {
		return fmt.Errorf("error", resp.StatusCode)

	}
	defer outFile.Close()
	fmt.Print("response body", resp.Body)
	_, err = io.Copy(outFile, resp.Body)
	return nil
}
