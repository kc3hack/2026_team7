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
	// .env を読み込む
	if err := godotenv.Load(); err != nil {
		log.Printf("No .env file found: %v", err)
	}

	// GitHub OAuth2 の設定
	GihubOAuthConfig = &oauth2.Config{
		ClientID:     os.Getenv("GITHUB_CLIENT_ID"),
		ClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("REDIRECT_URL"),
		Scopes:       []string{
			"read:user", "user:email", "profile", "read:repo", "content:read", "issue:read", "pull_request:read",
		},
		Endpoint:     github.Endpoint,
	}
}

func GetEnv(key, defaultValue string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return defaultValue
}

func GetStateString() string {
	state := GetEnv("STATE_STRING", "RANDOM_STRING_gpoi3hj93rjloi4bnjrln32n6l5jnr")
	return state
}
