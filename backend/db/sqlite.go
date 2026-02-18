package db

import (
	"database/sql"
	"log"
	"os"

	_ "modernc.org/sqlite"
)

var DB *sql.DB

func InitSQLite() {
	dbPath := os.Getenv("DB_PATH")

	// データベースパスが環境変数に設定されていない場合は、デフォルトのパスを使用
	if dbPath == "" {
		dbPath = "./guild.db"
	}

	// SQLite データベースに接続
	var err error
	DB, err = sql.Open("sqlite", dbPath+"?_journal_mode=WAL")
	if err != nil {
		log.Panicf("Failed to open SQLite database: %v\n", err)
	}

	// 書き込み競合を防ぐ設定
	DB.SetMaxOpenConns(1)

	// 接続確認
	if err := DB.Ping(); err != nil {
		log.Fatalf("Failed to ping SQLite database: %v\n", err)
	}
	
	log.Printf("Connected to SQLite database at: %s\n", dbPath)
}