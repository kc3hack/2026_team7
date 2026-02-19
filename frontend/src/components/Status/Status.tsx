import React from 'react';
import UpdateBtn from '../UpdateBtn/UpdateBtn';
import './Status.css';

interface StatusProps {
  /** 現在のステータス: initial (未更新) | updating (更新中) | updated (更新済) */
  status: 'initial' | 'updating' | 'updated';
  /** ボタンクリック時のコールバック */
  onAction?: () => void;
}

const Status: React.FC<StatusProps> = ({ status, onAction }) => {
  // ステータスに応じた日本語のラベルを定義
  const getStatusLabel = () => {
    switch (status) {
      case 'initial':
        return '未更新';
      case 'updating':
        return '更新中';
      case 'updated':
        return '更新済';
      default:
        return '';
    }
  };

  return (
    <div className="status-container">
      {/* 状態を示すラベル（未更新・更新中・更新済） */}
      <p className="status-label-text">{getStatusLabel()}</p>
      
      {/* ボタンコンポーネントを呼び出し。statusをそのまま渡す */}
      <div className="status-button-wrapper">
        <UpdateBtn status={status} onClick={onAction} />
      </div>
    </div>
  );
};

export default Status;