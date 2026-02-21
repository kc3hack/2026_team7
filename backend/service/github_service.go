package service

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"sort"
	"time"

	"golang.org/x/oauth2"
)

// GitHubUserProfile はGitHub APIの /user レスポンス
type GitHubUserProfile struct {
	Login       string `json:"login"`
	ID          int64  `json:"id"`
	AvatarURL   string `json:"avatar_url"`
	Name        string `json:"name"`
	Bio         string `json:"bio"`
	Company     string `json:"company"`
	Location    string `json:"location"`
	Blog        string `json:"blog"`
	PublicRepos int    `json:"public_repos"`
	Followers   int    `json:"followers"`
	CreatedAt   string `json:"created_at"`
}

// GitHubRepo はリポジトリ情報
type GitHubRepo struct {
	Name            string `json:"name"`
	FullName        string `json:"full_name"`
	Private         bool   `json:"private"`
	StargazersCount int    `json:"stargazers_count"`
	Size            int    `json:"size"` // KB単位のリポジトリサイズ
	Language        string `json:"language"`
	Fork            bool   `json:"fork"`
}

// GitHubEvent はGitHubイベント情報（コミット時刻取得用）
type GitHubEvent struct {
	Type      string `json:"type"`
	CreatedAt string `json:"created_at"`
	Payload   struct {
		Commits []struct {
			Author struct {
				Date string `json:"date"`
			} `json:"author"`
		} `json:"commits"`
	} `json:"payload"`
}

// GitHubSocialAccount はGitHubソーシャルアカウント
type GitHubSocialAccount struct {
	Provider string `json:"provider"`
	URL      string `json:"url"`
}

// SearchResult は検索APIのレスポンス
type SearchResult struct {
	TotalCount int `json:"total_count"`
}

// GitHubService はGitHub APIを呼ぶサービス
type GitHubService struct {
	client *http.Client
	user   string
}

// NewGitHubService は新しいGitHubServiceを作成する
func NewGitHubService(ctx context.Context, token *oauth2.Token, oauthConfig *oauth2.Config) *GitHubService {
	client := oauthConfig.Client(ctx, token)
	return &GitHubService{client: client}
}

// NewGitHubServiceWithToken はアクセストークン文字列からGitHubServiceを作成する
func NewGitHubServiceWithToken(accessToken string) *GitHubService {
	ts := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: accessToken})
	client := oauth2.NewClient(context.Background(), ts)
	return &GitHubService{client: client}
}

func (s *GitHubService) doGet(url string) ([]byte, error) {
	resp, err := s.client.Get(url)
	if err != nil {
		return nil, fmt.Errorf("GET %s に失敗しました: %w", url, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("GET %s がステータス %d を返しました: %s", url, resp.StatusCode, string(body))
	}

	return io.ReadAll(resp.Body)
}

// GetUserProfile はユーザープロフィールを取得する
func (s *GitHubService) GetUserProfile() (*GitHubUserProfile, error) {
	body, err := s.doGet("https://api.github.com/user")
	if err != nil {
		return nil, err
	}

	var profile GitHubUserProfile
	if err := json.Unmarshal(body, &profile); err != nil {
		return nil, fmt.Errorf("ユーザープロフィールの解析に失敗しました: %w", err)
	}
	s.user = profile.Login
	return &profile, nil
}

// GetAllRepos はユーザーの全リポジトリを取得する（private含む）
func (s *GitHubService) GetAllRepos() ([]GitHubRepo, error) {
	var allRepos []GitHubRepo
	page := 1

	for {
		url := fmt.Sprintf("https://api.github.com/user/repos?per_page=100&page=%d&type=all", page)
		body, err := s.doGet(url)
		if err != nil {
			return nil, err
		}

		var repos []GitHubRepo
		if err := json.Unmarshal(body, &repos); err != nil {
			return nil, fmt.Errorf("リポジトリ情報の解析に失敗しました: %w", err)
		}

		if len(repos) == 0 {
			break
		}

		allRepos = append(allRepos, repos...)
		page++

		// 安全対策: 最大50ページ
		if page > 50 {
			break
		}
	}

	return allRepos, nil
}

// GetRepoLanguages は特定リポジトリの言語バイト数を取得する
func (s *GitHubService) GetRepoLanguages(owner, repo string) (map[string]int64, error) {
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/languages", owner, repo)
	body, err := s.doGet(url)
	if err != nil {
		return nil, err
	}

	var languages map[string]int64
	if err := json.Unmarshal(body, &languages); err != nil {
		return nil, fmt.Errorf("使用言語情報の解析に失敗しました: %w", err)
	}

	return languages, nil
}

// GetAllLanguages は全リポジトリの言語を集約する（API負荷軽減のため上位30リポに限定）
func (s *GitHubService) GetAllLanguages(repos []GitHubRepo) (map[string]int64, int64) {
	aggregated := make(map[string]int64)
	var totalCharCount int64

	// フォークを除外し、サイズ降順でソート
	var nonFork []GitHubRepo
	for _, repo := range repos {
		if !repo.Fork {
			nonFork = append(nonFork, repo)
		}
	}
	sort.Slice(nonFork, func(i, j int) bool {
		return nonFork[i].Size > nonFork[j].Size
	})

	// API負荷軽減: 上位30リポのみ言語情報を取得
	const maxLangRepos = 30
	if len(nonFork) > maxLangRepos {
		nonFork = nonFork[:maxLangRepos]
	}

	for _, repo := range nonFork {
		languages, err := s.GetRepoLanguages(s.user, repo.Name)
		if err != nil {
			log.Printf("警告: %s の使用言語情報の取得に失敗しました: %v", repo.FullName, err)
			continue
		}

		for lang, bytes := range languages {
			aggregated[lang] += bytes
			totalCharCount += bytes
		}
	}

	return aggregated, totalCharCount
}

// GetTotalStars は全リポジトリのスター合計数を取得する
func (s *GitHubService) GetTotalStars(repos []GitHubRepo) int {
	total := 0
	for _, repo := range repos {
		if !repo.Fork {
			total += repo.StargazersCount
		}
	}
	return total
}

// GetCommitCount は直近1年のコミット数を取得する
func (s *GitHubService) GetCommitCount(username string) int {
	oneYearAgo := time.Now().AddDate(-1, 0, 0).Format("2006-01-02")
	url := fmt.Sprintf("https://api.github.com/search/commits?q=author:%s+committer-date:>%s&per_page=1", username, oneYearAgo)

	body, err := s.doGet(url)
	if err != nil {
		log.Printf("警告: コミット数の取得に失敗しました: %v", err)
		return 0
	}

	var result SearchResult
	if err := json.Unmarshal(body, &result); err != nil {
		log.Printf("警告: コミット解析に失敗しました: %v", err)
		return 0
	}

	return result.TotalCount
}

// GetPRCount は直近1年のPR数を取得する
func (s *GitHubService) GetPRCount(username string) int {
	oneYearAgo := time.Now().AddDate(-1, 0, 0).Format("2006-01-02")
	url := fmt.Sprintf("https://api.github.com/search/issues?q=author:%s+type:pr+created:>%s&per_page=1", username, oneYearAgo)

	body, err := s.doGet(url)
	if err != nil {
		log.Printf("警告: PR数の取得に失敗しました: %v", err)
		return 0
	}

	var result SearchResult
	if err := json.Unmarshal(body, &result); err != nil {
		log.Printf("警告: PR解析に失敗しました: %v", err)
		return 0
	}

	return result.TotalCount
}

// GetSocialAccounts はGitHubのソーシャルアカウントを取得する
func (s *GitHubService) GetSocialAccounts() ([]GitHubSocialAccount, error) {
	body, err := s.doGet("https://api.github.com/user/social_accounts")
	if err != nil {
		log.Printf("警告: ソーシャルアカウントの取得に失敗しました: %v", err)
		return nil, nil
	}

	var accounts []GitHubSocialAccount
	if err := json.Unmarshal(body, &accounts); err != nil {
		return nil, fmt.Errorf("ソーシャルアカウントの解析に失敗しました: %w", err)
	}

	return accounts, nil
}

// GetRecentCommitHours は直近のイベントからコミット時刻（時間帯）を取得する
func (s *GitHubService) GetRecentCommitHours(username string) []int {
	var allHours []int

	// イベントAPIは最大3ページ（300件）まで取得（API負荷軽減）
	for page := 1; page <= 3; page++ {
		url := fmt.Sprintf("https://api.github.com/users/%s/events?per_page=100&page=%d", username, page)
		body, err := s.doGet(url)
		if err != nil {
			break
		}

		var events []GitHubEvent
		if err := json.Unmarshal(body, &events); err != nil {
			break
		}

		if len(events) == 0 {
			break
		}

		for _, event := range events {
			if event.Type == "PushEvent" {
				t, err := time.Parse(time.RFC3339, event.CreatedAt)
				if err == nil {
					allHours = append(allHours, t.Hour())
				}
			}
		}
	}

	return allHours
}
