package db

import (
	"log"

	"github.com/kc3hack/2026_team7/config"
	"github.com/kc3hack/2026_team7/model"
	"gorm.io/driver/mysql"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	var err error
	driver := config.GetDBDriver()
	dsn := config.GetDBDSN()

	switch driver {
	case "sqlite":
		log.Printf("SQLiteデータベースに接続中: %s", dsn)
		DB, err = gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	default:
		log.Printf("MySQLデータベースに接続中")
		DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	}

	if err != nil {
		log.Fatalf("データベースへの接続に失敗しました: %v", err)
	}

	// オートマイグレーション
	if err := DB.AutoMigrate(
		&model.User{},
		&model.UserCard{},
		&model.UserLanguage{},
	); err != nil {
		log.Fatalf("AutoMigrateに失敗しました: %v", err)
	}

	sqlDB, err := DB.DB()
	if driver == "sqlite" {
		sqlDB.SetMaxOpenConns(1) // SQLiteはシングルスレッドで動作するため、接続数を1に制限
	}

	log.Printf("データベースの初期化が完了しました (ドライバ: %s)", driver)
}
