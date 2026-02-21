import React from 'react';
import { useQr } from '../../hooks/qr';
import BoxFrame from '../BoxFrame/BoxFrame';
import './QR.css';

type Props = {
  onClose?: () => void;
  user_name: string;
};

const QR: React.FC<Props> = ({ onClose, user_name }) => {
  const { qrData, loading, error } = useQr(user_name);

  if (loading) return <p>Loading QR...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!qrData) return <p>No QR data</p>;
  return (
    <BoxFrame>
      <div className="qr-page-container">
        <div className="qr-layout">
          {/* QRコード表示部 */}
          <div className="qr-visual">
            {/* QRコード画像がここに入ります */}

            <div className="qr-box">
              <img src={qrData.qr_image_url} alt="QR-Code" />
            </div>
          </div>

          {/* テキスト情報部：スライド5ページ目の内容 */}
          <div className="qr-details">
            <p className="user-id">ID：{user_name}</p>
            <p className="user-url">URL</p>
            <p className="user-url">https://example.com/cards/{user_name}/</p>
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
