import './Update.css';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
// ファイル名が update.ts の場合はこちら。useUpdateStatus.ts の場合は適宜書き換えてください
import { useUpdateStatus } from '../../hooks/update'; 
import BoxFrame from '../../components/BoxFrame/BoxFrame';
import Status from '../../components/Status/Status';
import UpdateBtn from '../../components/UpdateBtn/UpdateBtn';
import { fetchUserId } from '../../utils/auth';

type UpdateStatus = 'initial' | 'updating' | 'updated';

const Update = () => {
  // 1. URLからID（e1q23079など）を取得
  const { id } = useParams<{ id: string }>();
  const user_name = id || "unknown";

  // 2. フックを使用して現在の状態を取得
  const { status, loading, error: hookError } = useUpdateStatus();
  
  // 3. ボタンクリック直後の「更新中」を表現するためのローカル状態
  const [isUpdating, setIsUpdating] = useState(false);

  // 4. フックの状態とローカルの状態を組み合わせて、最終的な表示ステータスを決定
  const currentStatus = useMemo((): UpdateStatus => {
    if (isUpdating || loading) return 'updating';
    if (status?.status) return 'updated';
    return 'initial';
  }, [loading, status, isUpdating]);

  // 5. 更新ボタンが押された時の処理
  const handleUpdate = async () => {
    setIsUpdating(true); // ボタンを押した瞬間に更新中表示にする
    
    try {
      // ログインIDの取得を試みる。失敗（JSONエラー等）した場合は URL の id を優先する
      let targetId = id;
      try {
        const authId = await fetchUserId();
        if (authId) targetId = authId;
      } catch (e) {
        console.warn("Auth API failed, using ID from URL:", id);
      }

      const response = await fetch(`/api/v1/cards/${targetId}/update`, { 
        method: "POST" 
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      // 成功したら画面をリロードして、最新の status (updated) を取得し直す
      window.location.reload(); 
      
    } catch (err) {
      console.error("Update error:", err);
      alert("更新に失敗しました。コンソールを確認してください。");
      setIsUpdating(false);
    }
  };

  // エラー表示（フック自体のエラーがある場合）
  if (hookError) {
    return (
      <div className="page">
        <p className="error">データの取得に失敗しました: {hookError}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <BoxFrame>
        <div className="container_outer">
          <h1 className="title_update">Skill Update</h1>

          {/* 補足仕様：status (initial | updating | updated) を渡す */}
          <Status status={currentStatus} />

          <p className="user-id">ID : {user_name}</p>

          <UpdateBtn
            status={currentStatus}
            onClick={handleUpdate}
          />
        </div>
      </BoxFrame>
    </div>
  );
};

export default Update;