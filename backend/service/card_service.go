package service

import (
	"math"
	"time"
)

// CalculateTechnicalLevel は技術レベルを計算する (0-100)
// 言語数×3 + log10(総コード量)×8 + エンジニア歴(年)×3
func CalculateTechnicalLevel(langCount int, totalCharCount int64, githubJoinedAt time.Time) int {
	yearsActive := time.Since(githubJoinedAt).Hours() / (24 * 365.25)

	// 係数を調整して100に行きにくくする
	// 例: 5言語(15) + 1MB(約48) + 3年(9) = 72
	score := float64(langCount)*3 +
		math.Log10(float64(totalCharCount)+1)*8 +
		yearsActive*3

	result := int(math.Min(100, score))
	if result < 0 {
		return 0
	}
	return result
}

// CalculateActivityScore は活動指数を計算する (0-100)
// (直近1年のコミット数/365)×50 + (直近1年のPR数/50)×50
func CalculateActivityScore(commitCount, prCount int) int {
	commitPart := (float64(commitCount) / 365.0) * 50.0
	prPart := (float64(prCount) / 50.0) * 50.0

	result := int(math.Min(100, commitPart+prPart))
	if result < 0 {
		return 0
	}
	return result
}

// CalculateCharmScore は魅力指数を計算する (0-100)
// log10(総スター数+1)×30 + log10(フォロワー数+1)×30
func CalculateCharmScore(totalStars, followers int) int {
	starPart := math.Log10(float64(totalStars)+1) * 30.0
	followerPart := math.Log10(float64(followers)+1) * 30.0

	result := int(math.Min(100, starPart+followerPart))
	if result < 0 {
		return 0
	}
	return result
}
