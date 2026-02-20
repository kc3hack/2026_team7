package handler

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"io"
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/kc3hack/2026_team7/config"
	"github.com/kc3hack/2026_team7/db"
	"github.com/kc3hack/2026_team7/model"
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

func HandleGitHubLogin(c *gin.Context) {
	// CSRF対策: リクエストごとにランダムな state を生成しセッションに保存
	state, err := generateRandomState()
	if err != nil {
		log.Printf("state生成に失敗しました: %v\n", err)
		c.String(http.StatusInternalServerError, "state生成に失敗しました")
		return
	}

	session := sessions.Default(c)
	session.Set("oauth_state", state)
	session.Save()

	url := config.GihubOAuthConfig.AuthCodeURL(state)
	log.Printf("GitHub OAuth2 URLにリダイレクト中: %s\n", url)
	c.Redirect(http.StatusFound, url)
}

func HandleGitHubCallback(c *gin.Context) {
	// GitHub からのコールバックを処理
	code := c.Query("code")
	state := c.Query("state")

	// セッションからstateを取得して検証
	session := sessions.Default(c)
	savedState := session.Get("oauth_state")
	if savedState == nil || savedState.(string) != state {
		c.String(http.StatusBadRequest, "stateパラメータが不正です")
		return
	}
	session.Delete("oauth_state")

	// コードをアクセストークンに交換
	token, err := config.GihubOAuthConfig.Exchange(c.Request.Context(), code)
	if err != nil {
		log.Printf("コードをトークンに交換するのに失敗しました: %v\n", err)
		c.String(http.StatusInternalServerError, "コードをトークンに交換するのに失敗しました")
		return
	}

	// GitHub APIからユーザー情報を取得
	client := config.GihubOAuthConfig.Client(c.Request.Context(), token)
	resp, err := client.Get("https://api.github.com/user")
	if err != nil {
		log.Printf("ユーザー情報の取得に失敗しました: %v\n", err)
		c.String(http.StatusInternalServerError, "ユーザー情報の取得に失敗しました")
		return
	}
	defer resp.Body.Close()

	// ユーザー情報を構造体にデコード
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("ユーザー情報の読み込みに失敗しました: %v\n", err)
		c.String(http.StatusInternalServerError, "ユーザー情報の読み込みに失敗しました")
		return
	}

	var user GitHubUser
	if err := json.Unmarshal(body, &user); err != nil {
		log.Printf("ユーザープロフィールの解析に失敗しました: %v\n", err)
		c.String(http.StatusInternalServerError, "ユーザープロフィールの解析に失敗しました")
		return
	}
	log.Printf("ユーザー情報: Login=%s, ID=%d, Name=%s\n", user.Login, user.ID, user.Name)

	// DBにユーザーを保存（存在しなければ作成）
	var dbUser model.User
	result := db.DB.Where("user_name = ?", user.Login).First(&dbUser)
	if result.Error != nil {
		dbUser = model.User{
			GitHubID: int64(user.ID),
			UserName:  user.Login,
			AvatarURL: user.AvatarURL,
		}
		if err := db.DB.Create(&dbUser).Error; err != nil {
        log.Printf("ユーザー作成エラー: %v\n", err)
        c.String(http.StatusInternalServerError, "DBへのユーザー登録に失敗しました")
        return
    }
  } else {
    if err := db.DB.Model(&dbUser).Updates(model.User{
        UserName:  user.Login,
        AvatarURL: user.AvatarURL,
    }).Error; err != nil {
        log.Printf("ユーザー更新エラー: %v\n", err)
        c.String(http.StatusInternalServerError, "DBのユーザー情報更新に失敗しました")
        return
    }
  }

	// セッションにユーザー情報とアクセストークンを保存
	session.Set("user_id", dbUser.ID)
	session.Set("user_name", user.Login)
	session.Set("access_token", token.AccessToken)
	session.Save()

	// フロントエンドのコールバックページにリダイレクト
	frontendURL := config.GetFrontendURL()
	c.Redirect(http.StatusFound, frontendURL+"/callback.html?login=success&user="+user.Login)
}

// HandleGetMe は現在ログイン中のユーザー情報を返す
func HandleGetMe(c *gin.Context) {
	session := sessions.Default(c)
	userName := session.Get("user_name")
	userID := session.Get("user_id")
	accessToken := session.Get("access_token")

	if userName == nil || accessToken == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "未ログイン"})
		return
	}

	// DBからアバターURLを取得
	var user model.User
	db.DB.Where("user_name = ?", userName).First(&user)

	c.JSON(http.StatusOK, gin.H{
		"id":           userID,
		"user_name":    userName,
		"avatar_url":   user.AvatarURL,
	})
}

// HandleLogout はセッションを破棄してログアウトする
func HandleLogout(c *gin.Context) {
	session := sessions.Default(c)
	session.Clear()
	session.Save()

	c.JSON(http.StatusOK, gin.H{"message": "ログアウトしました"})
}
