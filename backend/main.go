package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/kc3hack/2026_team7/config"
	"github.com/kc3hack/2026_team7/handler"
)

func main() {
	// 設定をロード
	config.LoadConfig()

	// ルーティング設定
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `
			<h1>Engineer Card Backend: Hello World!</h1>
			<p><a href="/api/v1/auth/login">GitHubにログイン</a></p>
		`)
	})

	// GitHub OAuth2 ログインハンドラー
	http.HandleFunc("/api/v1/auth/login", handler.HandleGitHubLogin)
	// GitHub OAuth2 コールバックハンドラー
	http.HandleFunc("/api/v1/auth/callback", handler.HandleGitHubCallback)

	// サーバーを起動
	port := ":8080"
	log.Printf("サーバーを起動しました: http://localhost%s\n", port)

	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatal(err)
	}
}
