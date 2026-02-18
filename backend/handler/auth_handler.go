package handler

import (
	"fmt"
	"log"
	"net/http"
	"io"
	"encoding/json"

	"github.com/kc3hack/2026_team7/config"
)

//GitHub APIから返ってくるレスポンスの構造体
type GitHubUser struct {
	Login     string `json:"login"`
	ID        int    `json:"id"`
	AvatarURL string `json:"avatar_url"`
	Name      string `json:"name"`
}

func HandleGitHubLogin(w http.ResponseWriter, r *http.Request) {
	// CRSF 対策のための state を生成
	state := config.GetStateString()
	url := config.GihubOAuthConfig.AuthCodeURL(state)

	log.Printf("Redirecting to GitHub OAuth2 URL: %s\n", url)
	http.Redirect(w, r, url, http.StatusFound)
}

func HandleGitHubCallback(w http.ResponseWriter, r *http.Request) {
	// GitHub からのコールバックを処理
	code := r.URL.Query().Get("code")
	state := r.URL.Query().Get("state")

	if state != config.GetStateString() {
		http.Error(w, "Invalid state parameter", http.StatusBadRequest)
		return
	}

	// コードをアクセストークンに交換
	token, err := config.GihubOAuthConfig.Exchange(r.Context(), code)
	if err != nil {
		log.Printf("Failed to exchange code for token: %v\n", err)
		http.Error(w, "Failed to exchange code for token", http.StatusInternalServerError)
		return
	}

	// GitHub APIからユーザー情報を取得
	client := config.GihubOAuthConfig.Client(r.Context(), token)
	resp, err := client.Get("https://api.github.com/user")
	if err != nil {
		log.Printf("Failed to get user info: %v\n", err)
		http.Error(w, "Failed to get user info", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// ユーザー情報を構造体にデコード
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Failed to read user info: %v\n", err)
		http.Error(w, "Failed to read user info", http.StatusInternalServerError)
		return
	}

	// ユーザー情報をログに出力
	var user GitHubUser
	if err := json.Unmarshal(body, &user); err != nil {
		log.Printf("Failed to unmarshal user info: %v\n", err)
		http.Error(w, "Failed to unmarshal user info", http.StatusInternalServerError)
		return
	}
	log.Printf("User Info: Login=%s, ID=%d, Name=%s\n", user.Login, user.ID, user.Name)

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	fmt.Fprintf(w, `
		<h1>GitHub OAuth2 Login Successful!</h1>
		<p>Login: %s</p>
		<p>ID: %d</p>
		<p>Name: %s</p>
		<img src="%s" alt="Avatar" width="100" height="100">
		<a href="/">Go Back</a>
	`, user.Login, user.ID, user.Name, user.AvatarURL)
}