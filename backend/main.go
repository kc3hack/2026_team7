package main

import (
	"log"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/kc3hack/2026_team7/config"
	"github.com/kc3hack/2026_team7/db"
	"github.com/kc3hack/2026_team7/handler"
)

func main() {
	// 設定をロード
	config.LoadConfig()

	// データベースを初期化
	db.InitDB()

	// Ginルーターを作成
	r := gin.Default()

	// Cookieセッションストアを設定
	store := cookie.NewStore([]byte(config.GetEnv("SESSION_SECRET", "secret")))
	r.Use(sessions.Sessions("session", store))

	// CORSミドルウェア
	r.Use(handler.CORSMiddleware())

	// 認証ルート
	auth := r.Group("/api/v1/auth")
	{
		auth.GET("/login", handler.HandleGitHubLogin)
		auth.GET("/callback", handler.HandleGitHubCallback)
		auth.GET("/me", handler.HandleGetMe)
		auth.POST("/logout", handler.HandleLogout)
	}

	// カードルート
	cards := r.Group("/api/v1/cards")
	{
		cards.GET("/:user_name", handler.HandleGetCard)
		cards.POST("/:id/update", handler.AuthRequired(), handler.SelfOnly(), handler.HandleUpdateCard)
		cards.GET("/:user_name/qr", handler.HandleGetQR)
	}

	// サーバーを起動
	port := ":8080"
	log.Printf("サーバーを起動しました: http://localhost%s\n", port)
	if err := r.Run(port); err != nil {
		log.Fatal(err)
	}
}
