import './Update.css';
import { useMemo, useState } from 'react'; // useStateを追加
import { useParams } from 'react-router-dom';
import { useUpdateStatus } from '../../hooks/update'; 
import BoxFrame from '../../components/BoxFrame/BoxFrame';
import Status from '../../components/Status/Status';
import UpdateBtn from '../../components/UpdateBtn/UpdateBtn';

type UpdateStatus = 'initial' | 'updating' | 'updated';

const Update = () => {
  const { id } = useParams<{ id: string }>();
  const user_name = id || "unknown";

  const { status, loading, error, triggerUpdate } = useUpdateStatus();
  
  // ★ 演出用の「更新中」状態を管理するフラグ
  const [isAnimating, setIsAnimating] = useState(false);

  // ステータスの計算ロジックを修正
  const currentStatus = useMemo((): UpdateStatus => {
    // ボタンが押されてから「演出用の待ち時間」が終わるまでは 'updating' に固定する
    if (isAnimating || loading) return 'updating';
    if (status?.status) return 'updated';
    return 'initial';
  }, [loading, status, isAnimating]);

  const handleUpdate = async () => {
    if (currentStatus === 'updated' || loading) return;

    setIsAnimating(true); // 演出開始

    try {
      // 1. 実際の更新リクエストを送る
      await triggerUpdate();
      
      // 2. ★ ゲージがMaxになるのを待つための「あえての待ち時間」
      // 1.5秒〜2秒くらいに設定すると、ゲージが溜まっていく様子がしっかり見えます
      await new Promise(resolve => setTimeout(resolve, 2000)); 
      
    } catch (err) {
      console.error("更新処理に失敗しました:", err);
    } finally {
      setIsAnimating(false); // 演出終了 -> ここで 'updated' に切り替わる
    }
  };

  if (error) {
    return (
      <div className="page">
        <BoxFrame>
          <div className="container_outer">
            <h1 className="title_update">Error</h1>
            <p style={{ color: '#ff6b6b' }}>{error}</p>
          </div>
        </BoxFrame>
      </div>
    );
  }

  return (
    <div className="page">
      <BoxFrame>
        <div className="container_outer">
          <h1 className="title_update">Skill Update</h1>
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