package handler

import (
	"net/http"
	"fmt"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/kc3hack/2026_team7/config"
)

// CORSを設定
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		frontendURL := config.GetFrontendURL()

		c.Writer.Header().Set("Access-Control-Allow-Origin", frontendURL)
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

// 認証が必要なエンドポイント用ミドルウェア
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		session := sessions.Default(c)
		userID := session.Get("user_id")

		if userID == nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "認証が必要です"})
			c.Abort()
			return
		}

		c.Set("user_id", userID)
		c.Set("user_name", session.Get("user_name"))
		c.Next()
	}
}

// 自分自身のリソースのみアクセス可能なミドルウェア
func SelfOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("user_id")
		paramID := c.Param("id")

		if !exists || userID == nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "認証が必要です"})
			c.Abort()
			return
		}

		uIDStr := fmt.Sprintf("%v", userID)

		if uIDStr != paramID {
			c.JSON(http.StatusForbidden, gin.H{"error": "自分自身のリソースのみアクセス可能です"})
			c.Abort()
			return
		}

		c.Next()
	}
}
