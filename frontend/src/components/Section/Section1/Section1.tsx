import './Section1.css';

const Section1 = () => {
  return  <div className="card">
            <div className="left">
              <img src="/engineer.jpg" alt="engineer" />
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

                  <div className="big">6年</div>
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
          </div>;
};

export default Section1;
