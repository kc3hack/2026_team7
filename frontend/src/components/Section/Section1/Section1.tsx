import React from 'react';
import './Section1.css';
import BoxFrame from '../../BoxFrame/BoxFrame';

interface Section1Props {
  userName: string;
  userId: string;
  registeredDate: string;
  title: string;
  level: number; // LVを追加
  imageUrl: string; // 写真のURLを追加
  updatedDate: string; // スキル更新日時を追加
}

const getEngineerHistory = (registeredDate: string): number => {
  const start = new Date(registeredDate);
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  const thisYearMonthDay = new Date(now.getFullYear(), start.getMonth(), start.getDate());
  if (now < thisYearMonthDay) years--;
  return years > 0 ? years : 0;
};

const Section1: React.FC<Section1Props> = ({ userName, userId, registeredDate, title, level, imageUrl, updatedDate }) => {
  const history = getEngineerHistory(registeredDate);
  return(
  <BoxFrame>
    <div className="card">
            {/* 1. 写真エリア */}
            <div className="left">
                    
              <img src={imageUrl} alt="engineer" />
            </div>
            {/* 2. 名前・ID・QR枠 */}
            <div className="right">

              <div className="box name-box">
                <div className="top-row">
                  <span>エンジニア名</span>
                  <span className="id">ID : {userId}</span>
                </div>
                <div className="name">{userName}</div>
                <button className="qr-btn">QR表示</button>
              </div>
              {/* 3. 歴・登録日枠 */}
              <div className="middle-row">
                <div className="box history-box">
                  <div className="history-header">
                    <div className="Registration">エンジニア歴</div>
                    <div className="Registration-date">登録日：2019/03/10</div>
                  </div>

                  <div className="big">{history}年</div>
                </div>
                {/* 4. LV枠 */}
                <div className="box level-box">
                  <div className="level-title">LV</div>
                  <div className="level">{level}</div>
                </div>
              </div>
              {/* 5. 称号・スキル更新枠 */}
              <div className="box title-box">
                <div className="title">称号</div>
                <div className="title-neme">{title}</div>
                <button className="update-btn">スキル更新</button>
              </div>

              <div className="updated">
                スキル更新日時：{updatedDate}
              </div>

            </div>
          </div>
          </BoxFrame>
          );
};

export default Section1;
