package handler

import (
	"fmt"
	"log"
	"net/http"
	"sort"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/kc3hack/2026_team7/config"
	"github.com/kc3hack/2026_team7/db"
	"github.com/kc3hack/2026_team7/model"
	"github.com/kc3hack/2026_team7/service"
	"github.com/skip2/go-qrcode"
)

// CardResponse はカードAPIのレスポンス
type CardResponse struct {
	UserInfo *UserInfoResponse `json:"user_info"`
	CardInfo *CardInfoResponse `json:"card_info"`
}

// UserInfoResponse はユーザー情報レスポンス
type UserInfoResponse struct {
	AvatarURL      string              `json:"avatar_url"`
	UserName       string              `json:"user_name"`
	DisplayName    string              `json:"display_name"`
	GithubJoinedAt string              `json:"github_joined_at"`
	Bio            *string             `json:"bio"`
	Company        *string             `json:"company"`
	Location       *string             `json:"location"`
	Website        *string             `json:"website"`
	SocialAccounts []SocialAccountResp `json:"social_accounts"`
	IsSelf         bool                `json:"is_self"`
}

// SocialAccountResp はソーシャルアカウントレスポンス
type SocialAccountResp struct {
	URL string `json:"url"`
}

// CardInfoResponse はカード情報レスポンス
type CardInfoResponse struct {
	AliasTitle     string             `json:"alias_title"`
	TechnicalLevel int                `json:"technical_level"`
	LastUpdatedAt  string             `json:"last_updated_at"`
	Stats          StatsResponse      `json:"stats"`
	Languages      []LanguageResponse `json:"languages"`
	ActivityScore  int                `json:"activity_score"`
	CharmScore     int                `json:"charm_score"`
}

// StatsResponse は統計情報レスポンス
type StatsResponse struct {
	RepoCount      int   `json:"repo_count"`
	TotalCharCount int64 `json:"total_char_count"`
}

// LanguageResponse は言語情報レスポンス
type LanguageResponse struct {
	Name      string `json:"name"`
	CharCount int64  `json:"char_count"`
}

// HandleGetCard はユーザーのスキルカードを取得する
func HandleGetCard(c *gin.Context) {
	userName := c.Param("user_name")

	// ユーザーを検索
	var user model.User
	if err := db.DB.Where("user_name = ?", userName).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ユーザーが見つかりません"})
		return
	}

	// カード情報を検索
	var card model.UserCard
	if err := db.DB.Where("user_id = ?", user.ID).Preload("Languages").First(&card).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "カード情報が見つかりません。先にカードを更新してください。"})
		return
	}

	// 自分のカードかどうか
	session := sessions.Default(c)
	sessionUserID := session.Get("user_id")
	isSelf := false
	if sessionUserID != nil {
		if id, ok := sessionUserID.(uint); ok {
			isSelf = (id == user.ID)
		}
	}

	// レスポンス構築
	languages := make([]LanguageResponse, 0, len(card.Languages))
	for _, lang := range card.Languages {
		languages = append(languages, LanguageResponse{
			Name:      lang.Name,
			CharCount: lang.CharCount,
		})
	}

	// 言語をバイト数の降順でソート
	sort.Slice(languages, func(i, j int) bool {
		return languages[i].CharCount > languages[j].CharCount
	})

	resp := CardResponse{
		UserInfo: &UserInfoResponse{
			AvatarURL:      user.AvatarURL,
			UserName:       user.UserName,
			DisplayName:    user.DisplayName,
			GithubJoinedAt: formatTimePtr(user.GithubJoinedAt, "2006-01-02"),
			Bio:            nullableString(user.Bio),
			Company:        nullableString(user.Company),
			Location:       nullableString(user.Location),
			Website:        nullableString(user.Website),
			SocialAccounts: []SocialAccountResp{},
			IsSelf:         isSelf,
		},
		CardInfo: &CardInfoResponse{
			AliasTitle:     card.AliasTitle,
			TechnicalLevel: card.TechnicalLevel,
			LastUpdatedAt:  card.LastUpdatedAt.Format(time.RFC3339),
			Stats: StatsResponse{
				RepoCount:      card.RepoCount,
				TotalCharCount: card.TotalCharCount,
			},
			Languages:     languages,
			ActivityScore: card.ActivityScore,
			CharmScore:    card.CharmScore,
		},
	}

	// ソーシャルアカウント取得（アクセストークンがある場合）
	if user.AccessToken != "" {
		ghService := service.NewGitHubServiceWithToken(user.AccessToken)
		socialAccounts, err := ghService.GetSocialAccounts()
		if err == nil {
			for _, acc := range socialAccounts {
				resp.UserInfo.SocialAccounts = append(resp.UserInfo.SocialAccounts, SocialAccountResp{
					URL: acc.URL,
				})
			}
		}
	}

	c.JSON(http.StatusOK, resp)
}

// HandleUpdateCard はカード情報を更新する（認証必須、自分のみ）
func HandleUpdateCard(c *gin.Context) {
	idParam := c.Param("id")

	// セッションからユーザー情報取得
	session := sessions.Default(c)
	sessionUserID := session.Get("user_id")
	accessToken := session.Get("access_token")

	if sessionUserID == nil || accessToken == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "認証が必要です"})
		return
	}

	// 自分のカードのみ更新可能
	if fmt.Sprintf("%v", sessionUserID) != idParam {
		c.JSON(http.StatusForbidden, gin.H{"error": "自分自身のカードのみ更新可能です"})
		return
	}

	// ユーザーを検索
	var user model.User
	if err := db.DB.Where("id = ?", idParam).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ユーザーが見つかりません"})
		return
	}

	// GitHub APIからデータ取得
	ghService := service.NewGitHubServiceWithToken(accessToken.(string))

	// プロフィール取得・更新
	profile, err := ghService.GetUserProfile()
	if err != nil {
		log.Printf("ユーザープロフィールの取得に失敗しました: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "GitHubプロフィールの取得に失敗しました"})
		return
	}

	// ユーザー情報を更新
	user.DisplayName = profile.Name
	user.AvatarURL = profile.AvatarURL
	user.Bio = profile.Bio
	user.Company = profile.Company
	user.Location = profile.Location
	user.Website = profile.Blog
	if profile.CreatedAt != "" {
		joinedAt, err := parseGitHubTimeStr(profile.CreatedAt)
		if err == nil {
			user.GithubJoinedAt = &joinedAt
		}
	}
	db.DB.Save(&user)

	// 全リポジトリ取得
	repos, err := ghService.GetAllRepos()
	if err != nil {
		log.Printf("リポジトリ情報の取得に失敗しました: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "リポジトリ情報の取得に失敗しました"})
		return
	}

	// 言語集約
	langMap, totalCharCount := ghService.GetAllLanguages(repos)

	// コミット数・PR数取得
	commitCount := ghService.GetCommitCount(user.UserName)
	prCount := ghService.GetPRCount(user.UserName)

	// スター合計
	totalStars := ghService.GetTotalStars(repos)

	// コミット時刻取得 → 二つ名生成
	commitHours := ghService.GetRecentCommitHours(user.UserName)
	alias := service.GenerateAliasConsistent(commitHours, user.GitHubID)

	// スコア計算
	langCount := len(langMap)
	var joinedAt time.Time
	if user.GithubJoinedAt != nil {
		joinedAt = *user.GithubJoinedAt
	}
	technicalLevel := service.CalculateTechnicalLevel(langCount, totalCharCount, joinedAt)
	activityScore := service.CalculateActivityScore(commitCount, prCount)
	charmScore := service.CalculateCharmScore(totalStars, profile.Followers)

	// リポジトリ数（フォーク除外）
	repoCount := 0
	for _, repo := range repos {
		if !repo.Fork {
			repoCount++
		}
	}

	// カード情報をDBに保存（upsert）
	var card model.UserCard
	result := db.DB.Where("user_id = ?", user.ID).First(&card)
	if result.Error != nil {
		card = model.UserCard{UserID: user.ID}
	}

	card.AliasTitle = alias
	card.TechnicalLevel = technicalLevel
	card.RepoCount = repoCount
	card.TotalCharCount = totalCharCount
	card.ActivityScore = activityScore
	card.CharmScore = charmScore
	card.LastUpdatedAt = time.Now()

	if card.ID == 0 {
		db.DB.Create(&card)
	} else {
		db.DB.Save(&card)
	}

	// 既存の言語データを削除して再作成
	db.DB.Where("card_id = ?", card.ID).Delete(&model.UserLanguage{})
	for name, charCount := range langMap {
		lang := model.UserLanguage{
			CardID:    card.ID,
			Name:      name,
			CharCount: charCount,
		}
		db.DB.Create(&lang)
	}

	log.Printf("ユーザーのカードを更新しました: %s (tech=%d, activity=%d, charm=%d, alias=%s)\n",
		user.UserName, technicalLevel, activityScore, charmScore, alias)

	c.JSON(http.StatusOK, gin.H{"status": true})
}

// HandleGetQR はユーザーのカードQRコードを生成する
func HandleGetQR(c *gin.Context) {
	userName := c.Param("user_name")

	// ユーザーの存在確認
	var user model.User
	if err := db.DB.Where("user_name = ?", userName).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ユーザーが見つかりません"})
		return
	}

	// カードURLからQRコードを生成
	frontendURL := config.GetFrontendURL()
	cardURL := fmt.Sprintf("%s/cards/%s/", frontendURL, userName)

	qr, err := qrcode.Encode(cardURL, qrcode.Medium, 256)
	if err != nil {
		log.Printf("QRコードの生成に失敗しました: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "QRコードの生成に失敗しました"})
		return
	}

	c.Data(http.StatusOK, "image/png", qr)
}

// nullableString は空文字列をnilに変換する
func nullableString(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}

// formatTimePtr はtime.Timeポインタを安全にフォーマットする
func formatTimePtr(t *time.Time, layout string) string {
	if t == nil {
		return ""
	}
	return t.Format(layout)
}

// parseGitHubTimeStr はGitHubの日時文字列をtime.Timeにパースする
func parseGitHubTimeStr(s string) (time.Time, error) {
	layouts := []string{
		time.RFC3339,
		"2006-01-02T15:04:05Z",
		"2006-01-02",
	}
	for _, layout := range layouts {
		t, err := time.Parse(layout, s)
		if err == nil {
			return t, nil
		}
	}
	return time.Time{}, fmt.Errorf("日時の解析に失敗しました: %s", s)
}
