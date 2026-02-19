import React from 'react';
import './Section1.css';

interface Section1Props {
  userName: string;
  userId: string;
  registeredDate: string;
  title: string;
  level: number; // LVを追加
  imageUrl: string; // 写真のURLを追加
}

const getEngineerHistory = (registeredDate: string): number => {
  const start = new Date(registeredDate);
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  const thisYearMonthDay = new Date(now.getFullYear(), start.getMonth(), start.getDate());
  if (now < thisYearMonthDay) years--;
  return years > 0 ? years : 0;
};

const Section1: React.FC<Section1Props> = ({ userName, userId, registeredDate, title, level, imageUrl }) => {
  const history = getEngineerHistory(registeredDate);

  return (
    <div className="section1-container">
      {/* 1. 写真エリア */}
      <div className="photo-section">
        <img src={imageUrl} alt="profile" className="profile-image" />
      </div>

      {/* 2. 名前・ID・QR枠 */}
      <div className="info-item name-id-row">
        <div className="name-group">
          <span className="label">エンジニア名</span>
          <p className="value">{userName}</p>
        </div>
        <div className="id-group">
          <span className="label">ID : {userId}</span>
          <button className="qr-button">QR表示</button>
        </div>
      </div>

      {/* 3. 歴・登録日枠 */}
      <div className="info-item history-row">
        <div className="history-group">
          <span className="label">エンジニア歴</span>
          <p className="value">{history}年</p>
        </div>
        <div className="date-group">
          <span className="label">登録日 : {registeredDate}</span>
        </div>
      </div>

      {/* 4. LV枠 */}
      <div className="info-item lv-row">
        <span className="label">LV</span>
        <p className="lv-value">{level}</p>
      </div>

      {/* 5. 称号・スキル更新枠 */}
      <div className="info-item title-row">
        <div className="title-group">
          <span className="label">称号</span>
          <p className="value highlighted">{title}</p>
        </div>
        <button className="update-button-mini">スキル更新</button>
      </div>
    </div>
  );
};

export default Section1;
