package model

import (
	"time"
)

// User はGitHubユーザー情報を保持するモデル
type User struct {
	ID             uint       `gorm:"primaryKey" json:"id"`
	GitHubID       int64      `gorm:"column:github_id;uniqueIndex" json:"github_id"`
	UserName       string     `gorm:"size:255;uniqueIndex;not null" json:"user_name"`
	DisplayName    string     `gorm:"size:255" json:"display_name"`
	AvatarURL      string     `gorm:"size:512" json:"avatar_url"`
	Bio            string     `gorm:"type:text" json:"bio"`
	Company        string     `gorm:"size:255" json:"company"`
	Location       string     `gorm:"size:255" json:"location"`
	Website        string     `gorm:"size:512" json:"website"`
	GithubJoinedAt *time.Time `json:"github_joined_at"`
	AccessToken    string     `gorm:"size:512" json:"-"` // JSONに含めない
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
}

// UserCard はスキルカード情報を保持するモデル
type UserCard struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	UserID         uint           `gorm:"uniqueIndex" json:"user_id"`
	User           User           `gorm:"foreignKey:UserID" json:"-"`
	AliasTitle     string         `json:"alias_title"`      // 二つ名
	TechnicalLevel int            `json:"technical_level"`  // 技術レベル (0-100)
	RepoCount      int            `json:"repo_count"`       // リポジトリ数
	TotalCharCount int64          `json:"total_char_count"` // 総文字数（バイト数）
	ActivityScore  int            `json:"activity_score"`   // 活動指数 (0-100)
	CharmScore     int            `json:"charm_score"`      // 魅力指数 (0-100)
	LastUpdatedAt  time.Time      `json:"last_updated_at"`
	Languages      []UserLanguage `gorm:"foreignKey:CardID" json:"languages"`
}

// UserLanguage はユーザーの使用言語情報
type UserLanguage struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	CardID    uint   `json:"card_id"`
	Name      string `json:"name"`
	CharCount int64  `json:"char_count"` // その言語のバイト数
}

// SocialAccount はGitHubのソーシャルアカウント情報（DBには保存せずAPI経由で取得）
type SocialAccount struct {
	Provider string `json:"provider"`
	URL      string `json:"url"`
}
