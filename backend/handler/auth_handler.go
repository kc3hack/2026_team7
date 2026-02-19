package handler

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/kc3hack/2026_team7/config"
)

// GitHub APIから返ってくるレスポンスの構造体
type GitHubUser struct {
	Login     string `json:"login"`
	ID        int    `json:"id"`
	AvatarURL string `json:"avatar_url"`
	Name      string `json:"name"`
}

// 安全なランダム文字列を生成
func generateRandomState() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

func HandleGitHubLogin(w http.ResponseWriter, r *http.Request) {
	// CSRF対策: リクエストごとにランダムな state を生成しCookieに保存
	state, err := generateRandomState()
	if err != nil {
		log.Printf("state生成に失敗しました: %v\n", err)
		http.Error(w, "state生成に失敗しました", http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "oauth_state",
		Value:    state,
		Path:     "/",
		HttpOnly: true,
		Secure:   r.TLS != nil,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   600,
	})

	url := config.GihubOAuthConfig.AuthCodeURL(state)
	log.Printf("GitHub OAuth2 URLにリダイレクト中: %s\n", url)
	http.Redirect(w, r, url, http.StatusFound)
}

func HandleGitHubCallback(w http.ResponseWriter, r *http.Request) {
	// GitHub からのコールバックを処理
	code := r.URL.Query().Get("code")
	state := r.URL.Query().Get("state")

	// Cookieからstateを取得して検証
	stateCookie, err := r.Cookie("oauth_state")
	if err != nil || stateCookie.Value == "" || state != stateCookie.Value {
		http.Error(w, "stateパラメータが不正です", http.StatusBadRequest)
		return
	}

	// 使用済みのstate Cookieを削除
	http.SetCookie(w, &http.Cookie{
		Name:     "oauth_state",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		MaxAge:   -1,
	})

	// コードをアクセストークンに交換
	token, err := config.GihubOAuthConfig.Exchange(r.Context(), code)
	if err != nil {
		log.Printf("コードをトークンに交換するのに失敗しました: %v\n", err)
		http.Error(w, "コードをトークンに交換するのに失敗しました", http.StatusInternalServerError)
		return
	}

	// GitHub APIからユーザー情報を取得
	client := config.GihubOAuthConfig.Client(r.Context(), token)
	resp, err := client.Get("https://api.github.com/user")
	if err != nil {
		log.Printf("ユーザー情報の取得に失敗しました: %v\n", err)
		http.Error(w, "ユーザー情報の取得に失敗しました", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// ユーザー情報を構造体にデコード
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("ユーザー情報の読み込みに失敗しました: %v\n", err)
		http.Error(w, "ユーザー情報の読み込みに失敗しました", http.StatusInternalServerError)
		return
	}

	// ユーザー情報をログに出力
	var user GitHubUser
	if err := json.Unmarshal(body, &user); err != nil {
		log.Printf("ユーザープロフィールの解析に失敗しました: %v\n", err)
		http.Error(w, "ユーザープロフィールの解析に失敗しました", http.StatusInternalServerError)
		return
	}
	log.Printf("ユーザー情報: Login=%s, ID=%d, Name=%s\n", user.Login, user.ID, user.Name)

	// フロントエンドのコールバックページにリダイレクト
	frontendURL := config.GetFrontendURL()
	redirectURL := fmt.Sprintf("%s/callback.html?login=success&user=%s", frontendURL, user.Login)
	http.Redirect(w, r, redirectURL, http.StatusFound)
}
