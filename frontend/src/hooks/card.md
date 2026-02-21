# useCardInfo Hook

`useCardInfo` は、指定した GitHub ユーザー名（またはエンジニア名）に対応するカード情報を取得するカスタム React フックです。API からデータを取得し、ローディングやエラー状態も管理します。

## インストール

特別なインストールは不要です。React 環境で直接使用できます。

```bash
npm install
```

## 使い方

```tsx
import React from 'react';
import { useCardInfo } from './hooks/useCardInfo';

const CardComponent = ({ user_name }: { user_name: string }) => {
  const { cardInfo, loading, error } = useCardInfo(user_name);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cardInfo) return <p>No data available</p>;

  return (
    <div>
      <img src={cardInfo.user_info.avatar_url} alt="avatar" />
      <h2>{cardInfo.user_info.display_name}</h2>
      <p>GitHub: {cardInfo.user_info.user_name}</p>
      <p>Joined: {cardInfo.user_info.github_joined_at}</p>
      <p>Bio: {cardInfo.user_info.bio}</p>
      <p>Company: {cardInfo.user_info.company || 'N/A'}</p>
      <p>Location: {cardInfo.user_info.location || 'N/A'}</p>
      <p>Website: {cardInfo.user_info.website || 'N/A'}</p>
      <p>Social Accounts: {cardInfo.user_info.social_accounts.join(', ')}</p>
      <p>Technical Level: {cardInfo.card_info.technical_level}</p>
      <p>Last Updated: {cardInfo.card_info.last_updated_at}</p>
      <p>Repository Count: {cardInfo.card_info.stats.repo_count}</p>
      <p>Total Bytes: {cardInfo.card_info.stats.total_bytes}</p>
      <p>Activity Score: {cardInfo.card_info.activity_score}</p>
      <p>Charm Score: {cardInfo.card_info.charm_score}</p>
      <h3>Languages:</h3>
      <ul>
        {cardInfo.card_info.languages.map((lang) => (
          <li key={lang.name}>
            {lang.name} - {lang.bytes} bytes
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CardComponent;
```

## パラメータ

| パラメータ  | 型       | 説明                                               |
| ----------- | -------- | -------------------------------------------------- |
| `user_name` | `string` | 情報を取得したいユーザーの名前（API で利用される） |

## 戻り値

| プロパティ | 型                     | 説明                             |
| ---------- | ---------------------- | -------------------------------- |
| `cardInfo` | `CardResponse \| null` | API から取得したカード情報       |
| `loading`  | `boolean`              | データ取得中かどうか             |
| `error`    | `string \| null`       | エラーが発生した場合のメッセージ |

## データ構造

### CardResponse

```ts
interface CardResponse {
  user_info: UserInfo;
  card_info: CardInfo;
}
```

### UserInfo

```ts
interface UserInfo {
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
```

### CardInfo

```ts
interface CardInfo {
  alias_title: string;
  technical_level: number;
  last_updated_at: string; // ISO形式
  stats: Stats;
  languages: Language[];
  activity_score: number;
  charm_score: number;
}
```

### Stats

```ts
interface Stats {
  repo_count: number;
  total_bytes: number;
}
```

### Language

```ts
interface Language {
  name: string;
  bytes: number;
}
```

## 注意点

- `user_name` が変更されるたびに API が呼ばれます。
- API のレスポンスが正しい形式であることを前提としています。
- 言語情報は `name` と `bytes` を持ち、各リポジトリのコード量を示します。
- 統計情報はリポジトリ数と総バイト数を含みます。
