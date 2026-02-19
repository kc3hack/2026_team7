import React from 'react';
import './Section1.css';

interface Section1Props {
  userName: string;
  userId: string;
  registeredDate: string; // "2019/03/10" のような形式を想定
  title: string;
}

/**
 * 登録日から現在までの年数を計算する関数
 * @param registeredDate 登録日 (YYYY/MM/DD)
 * @returns エンジニア歴 (年)
 */
const getEngineerHistory = (registeredDate: string): number => {
  const start = new Date(registeredDate);
  const now = new Date();
  
  let years = now.getFullYear() - start.getFullYear();
  
  // 誕生日の計算と同じ要領で、今年の登録日を過ぎていなければ1引く
  const thisYearMonthDay = new Date(now.getFullYear(), start.getMonth(), start.getDate());
  if (now < thisYearMonthDay) {
    years--;
  }
  
  return years > 0 ? years : 0;
};

const Section1: React.FC<Section1Props> = ({ userName, userId, registeredDate, title }) => {
  const history = getEngineerHistory(registeredDate);

  return (
    <div className="section1-container">
      {/* エンジニア名 */}
      <div className="info-item">
        <span className="label">エンジニア名</span>
        <p className="value">{userName}</p>
      </div>

      {/* ID */}
      <div className="info-item">
        <span className="label">ID</span>
        <p className="value">{userId}</p>
      </div>

      {/* エンジニア歴 (計算結果を表示) */}
      <div className="info-item">
        <span className="label">エンジニア歴</span>
        <p className="value">{history}年</p>
      </div>

      {/* 登録日 */}
      <div className="info-item">
        <span className="label">登録日</span>
        <p className="value">{registeredDate}</p>
      </div>

      {/* 称号 */}
      <div className="info-item">
        <span className="label">称号</span>
        <p className="value highlighted">{title}</p>
      </div>
    </div>
  );
};

export default Section1;