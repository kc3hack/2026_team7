# useUpdateStatus の使い方

useUpdateStatus は、指定したユーザーの更新ステータスを取得する React カスタムフックです。

## インポート

```ts
import { useUpdateStatus } from './hooks/useUpdateStatus';
```

## 使用例

```ts
import React from 'react';
import { useUpdateStatus } from './hooks/useUpdateStatus';

const UpdateStatusCard: React.FC<{ user_name: string }> = ({ user_name }) => {
    const { status, loading, error } = useUpdateStatus(user_name);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <p>User: {user_name}</p>
            <p>Status: {status?.status ? "Updated ✅" : "Not Updated ❌"}</p>
        </div>
    );
};

export default UpdateStatusCard;
```