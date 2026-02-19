import React from 'react';
import './Status.css';

interface StatusProps {
  /** 現在のステータス: initial (未更新) | updating (更新中) | updated (更新済) */
  status: 'initial' | 'updating' | 'updated';
  /** ボタンクリック時のコールバック */
  onAction?: () => void;
}

const Status: React.FC<StatusProps> = ({ status}) => {
  // ステータスに応じた日本語のラベルを定義
  switch (status) {
    case 'initial':
      return  <img src="/assets/img/not-updated.png" alt="img1" />
    case 'updating':
      return  <img src="/assets/img/updating.gif" alt="img2" />
    case 'updated':
      return  <img src="/assets/img/updated.png" alt="img3" />
  }
};
export default Status;