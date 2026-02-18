import './Section1.css';
import BoxFrame from '../../BoxFrame/BoxFrame';

type Props = {
  user_name: string;  // エンジニア名
  user_id: string;  // エンジニアID
  image_url: string;  // エンジニア画像URL
  registration_date: string;  // 登録日
  level: number;  // エンジニアレベル
  title_name: string; // 称号名
  skill_update_date: string;  // スキル更新日時
};

// 登録日からエンジニア歴を計算する関数
const getEngineerHistory = (registration_date: string): number => {
  return registration_date.length; // 修正必須
}

const Section1 = (props: Props) => {
  return(
  <BoxFrame>
    <div className="card">
            <div className="left">
              <img src="/assets/img/img.jpg" alt="engineer" />
            </div>

            <div className="right">

              <div className="box name-box">
                <div className="top-row">
                  <span>エンジニア名</span>
                  <span className="id">ID : yutota13</span>
                </div>
                <div className="name">ゆーと</div>
                <button className="qr-btn">QR表示</button>
              </div>

              <div className="middle-row">
                <div className="box history-box">
                  <div className="history-header">
                    <div className="Registration">エンジニア歴</div>
                    <div className="Registration-date">登録日：2019/03/10</div>
                  </div>

                  <div className="big">{getEngineerHistory(props.registration_date)}年</div>
                </div>

                <div className="box level-box">
                  <div className="level-title">LV</div>
                  <div className="level">120</div>
                </div>
              </div>

              <div className="box title-box">
                <div className="title">称号</div>
                <div className="title-neme">暁のエンジニア</div>
                <button className="update-btn">スキル更新</button>
              </div>

              <div className="updated">
                スキル更新日時：2026.02.17 05:43:32
              </div>

            </div>
          </div>
          </BoxFrame>
          );
};

export default Section1;
