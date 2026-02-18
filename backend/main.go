package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Engineer Card Backend: Hello World!")
	})

	port := ":8080"
	log.Printf("Server starting on http://localhost%s\n", port)
	
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatal(err)
	}
}