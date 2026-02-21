import React from 'react';
import './Section1.css';
import BoxFrame from '../../BoxFrame/BoxFrame';
import dayjs from 'dayjs';

interface Section1Props {
  userName: string;
  userId: string;
  registeredDate: string;
  title: string;
  level: number; // LVを追加
  imageUrl: string; // 写真のURLを追加
  updatedDate: string; // スキル更新日時を追加
  is_self: boolean; // 自分のプロフィールかどうかを示すフラグを追加
  is_update: boolean; // スキル更新が可能かどうかを示すフラグを追加
  onClickQR?: () => void;
  onClickUpdate?: () => void;
}

const getEngineerHistory = (registeredDate: string): number => {
  const start = new Date(registeredDate);
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  const thisYearMonthDay = new Date(
    now.getFullYear(),
    start.getMonth(),
    start.getDate(),
  );
  if (now < thisYearMonthDay) years--;
  return years > 0 ? years : 0;
};

const Section1: React.FC<Section1Props> = ({
  userName,
  userId,
  registeredDate,
  title,
  level,
  imageUrl,
  updatedDate,
  is_self,
  is_update,
  onClickQR,
  onClickUpdate,
}) => {
  const history = getEngineerHistory(registeredDate);
  return (
    <BoxFrame>
      <div className="card">
        {/* 1. 写真エリア */}
        <div className="left">
          <img src={imageUrl} alt="engineer" />
        </div>
        {/* 2. 名前・ID・QR枠 */}
        <div className="right">
<div className="box name-box">
  <span className="label-text">エンジニア名</span>
  <div className="name-row">
    <div className="name">{userName}</div>
    {is_self && (
      <button className="qr-btn btn" onClick={onClickQR}>
        QR表示
      </button>
    )}
  </div>
  <span className="id-text">ID : {userId}</span>
</div>
          {/* 3. 歴・登録日枠 */}
          <div className="middle-row">
<div className="box history-box">
  <div className="label-text">エンジニア歴</div>
  <div className="big">{history}年</div>
  <div className="Registration-date">
    登録日：
    <span className="regis-text">
      {dayjs(registeredDate).format('YYYY年MM月DD日')}
    </span>
  </div>
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
            {is_self && is_update ?(
              <button className="update-btn btn" onClick={onClickUpdate}>
              スキル更新
            </button>
            ) : null
            }
          </div>

          <div className="updated_date">
            スキル更新日時：{dayjs(updatedDate).format('YYYY.MM.DD HH.mm.ss')}
          </div>
        </div>
      </div>
    </BoxFrame>
  );
};

export default Section1;
