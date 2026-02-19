import React from 'react';
import BoxFrame from '../BoxFrame/BoxFrame';
import './QR.css';

type Props = {
  onClose?: () => void;
};

const QR: React.FC<Props> = ({ onClose }) => {  
  return (
    <BoxFrame>
      <div className="qr-page-container">
        <div className="qr-layout">
          {/* QRコード表示部 */}
          <div className="qr-visual">
            {/* QRコード画像がここに入ります */}
            <div className="qr-box">QR Code</div>
          </div>
          
          {/* テキスト情報部：スライド5ページ目の内容 */}
          <div className="qr-details">
            <p className="user-id">ID：yutota13</p>
            <p className="user-url">URL：https://example.com//cards/yutota13/</p>
          </div>

          {/* アクション部：一番下に配置 */}
          <div className="qr-actions">
            <button className="back-button" onClick={onClose}>
              閉じる
            </button>
          </div>
        </div>
      </div>
    </BoxFrame>
  );
};

export default QR;