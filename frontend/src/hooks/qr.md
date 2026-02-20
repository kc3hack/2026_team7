# useQr Hook

`useQr` は、指定したユーザーの QR コード情報を取得するカスタム React フックです。API からデータを取得し、ローディングやエラー状態も管理します。

## 使い方

```tsx
import React from "react";
import { useQr } from "./hooks/useQr";

const QrComponent = ({ user_name }: { user_name: string }) => {
  const { qrData, loading, error } = useQr(user_name);

  if (loading) return <p>Loading QR...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!qrData) return <p>No QR data</p>;

  return (
    <div>
      <p>Status: {qrData.status}</p>
      <img src={qrData.qr_image_url} alt="QR Code" />
    </div>
  );
};

export default QrComponent;
```

## パラメータ

| パラメータ       | 型        | 説明               |
| ----------- | -------- | ---------------- |
| `user_name` | `string` | QR 情報を取得したいユーザー名 |

## 戻り値

| プロパティ     | 型                    | 説明               |
| --------- | -------------------- | ---------------- |
| `qrData`  | `QrResponse \| null` | 取得した QR 情報       |
| `loading` | `boolean`            | データ取得中かどうか       |
| `error`   | `string \| null`     | エラーが発生した場合のメッセージ |

## データ構造

### QrResponse

```ts
interface QrResponse {
  status: string;
  qr_image_url: string;
}
```

## 注意点

* `user_name` が変更されるたびに API が呼ばれます。
* API のレスポンスが正しい形式であることを前提としています。
