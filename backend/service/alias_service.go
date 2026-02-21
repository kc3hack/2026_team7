package service

import (
	"math/rand"
)

// 時間帯別の二つ名候補
var aliasMap = map[string][]string{
	"midnight": {
		"闇夜の魔術師",
		"深淵のコーダー",
		"真夜中の錬成者",
		"漆黒のハッカー",
		"夜更かしの賢者",
	},
	"dawn": {
		"暁の番人",
		"朝霧のアーキテクト",
		"黎明の開拓者",
		"早起きの鍛冶師",
		"曙光のビルダー",
	},
	"morning": {
		"白昼の錬金術師",
		"正午の設計者",
		"陽光のエンジニア",
		"青空のクリエイター",
		"午前の探求者",
	},
	"afternoon": {
		"黄昏の職人",
		"夕暮れのビルダー",
		"午後の匠",
		"斜陽のストラテジスト",
		"薄暮のデザイナー",
	},
	"evening": {
		"静寂のナイトウォッチ",
		"月光のデプロイヤー",
		"宵闇のコマンダー",
		"星明かりのプログラマー",
		"夜風のスクライブ",
	},
}

// getTimePeriod は時間帯から期間名を返す
func getTimePeriod(hour int) string {
	switch {
	case hour >= 0 && hour < 6:
		return "midnight"
	case hour >= 6 && hour < 10:
		return "dawn"
	case hour >= 10 && hour < 15:
		return "morning"
	case hour >= 15 && hour < 19:
		return "afternoon"
	default:
		return "evening"
	}
}

// GenerateAlias はコミット時刻の分布から二つ名を生成する
func GenerateAlias(commitHours []int) string {
	if len(commitHours) == 0 {
		// コミットが無い場合はデフォルト
		return "未知の探求者"
	}

	// 時間帯ごとのカウント
	periodCount := map[string]int{
		"midnight":  0,
		"dawn":      0,
		"morning":   0,
		"afternoon": 0,
		"evening":   0,
	}

	for _, hour := range commitHours {
		period := getTimePeriod(hour)
		periodCount[period]++
	}

	// 最も多い時間帯を特定
	maxPeriod := "morning"
	maxCount := 0
	for period, count := range periodCount {
		if count > maxCount {
			maxPeriod = period
			maxCount = count
		}
	}

	// その時間帯の候補からランダムに選択（ユーザーごとに固定するために最多時間帯のcountをseedに使用）
	candidates := aliasMap[maxPeriod]
	idx := rand.Intn(len(candidates))
	return candidates[idx]
}

// GenerateAliasConsistent はコミット時刻から決定的に二つ名を生成する（同じ入力なら同じ結果）
func GenerateAliasConsistent(commitHours []int, userID int64) string {
	if len(commitHours) == 0 {
		return "未知の探求者"
	}

	// 時間帯ごとのカウント
	periodCount := map[string]int{
		"midnight":  0,
		"dawn":      0,
		"morning":   0,
		"afternoon": 0,
		"evening":   0,
	}

	for _, hour := range commitHours {
		period := getTimePeriod(hour)
		periodCount[period]++
	}

	// 最も多い時間帯を特定
	maxPeriod := "morning"
	maxCount := 0
	for period, count := range periodCount {
		if count > maxCount {
			maxPeriod = period
			maxCount = count
		}
	}

	// userIDを使って決定的に候補を選択
	candidates := aliasMap[maxPeriod]
	idx := int(userID) % len(candidates)
	return candidates[idx]
}
