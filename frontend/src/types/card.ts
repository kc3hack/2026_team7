// 言語情報
export interface Language {
    name: string;
    bytes: number;
}

// 統計情報
export interface Stats {
    repo_count: number;
    total_bytes: number;
}

// ユーザー情報
export interface UserInfo {
    avatar_url: string;
    user_name: string;
    display_name: string;
    github_joined_at: string; // ISO形式
    bio: string;
    company: string | null;
    location: string | null;
    website: string | null;
    social_accounts: string[];
    is_self: boolean;
}

// カード情報
export interface CardInfo {
    alias_title: string;
    technical_level: number;
    last_updated_at: string; // ISO形式
    stats: Stats;
    languages: Language[];
    activity_score: number;
    charm_score: number;
}

// 全体レスポンス
export interface CardResponse {
    user_info: UserInfo;
    card_info: CardInfo;
}
