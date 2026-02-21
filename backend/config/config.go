package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
)

var GihubOAuthConfig *oauth2.Config

func LoadConfig() {
	if err := godotenv.Load(); err != nil {
		log.Printf(".envファイルが見つかりません: %v", err)
	}

	// GitHub OAuth2 の設定
	GihubOAuthConfig = &oauth2.Config{
		ClientID:     os.Getenv("GITHUB_CLIENT_ID"),
		ClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("REDIRECT_URL"),
		Scopes: []string{
			"read:user", "user:email", "profile", "read:repo", "content:read", "issue:read", "pull_request:read",
		},
		Endpoint: github.Endpoint,
	}
}

func GetEnv(key, defaultValue string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return defaultValue
}

func GetDBDriver() string {
	return GetEnv("DB_DRIVER", "sqlite")
}

func GetDBDSN() string {
	return GetEnv("DB_DSN", "engineer_card.db")
}

func GetFrontendURL() string {
	return GetEnv("FRONTEND_URL", "http://localhost:3000")
}
