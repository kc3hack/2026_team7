import React from 'react';
import Header from '../../components/Header/Header';
import './Top.css';

const Top: React.FC = () => {
  // 中央ボタン用のログイン処理
  const handleGitHubLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = '/auth/github/login';
  };

  return (
    <div className="top-page-wrapper">
      {/* 修正したHeaderを呼び出す */}
      <Header />

      <main className="hero-section">
        <h1 className="product-title">GXPass</h1>

        <div className="message-area">
          <p className="main-message">
            君のコードが、
            <br className="mobile-only" />
            君の武器になる。
          </p>
          <p className="sub-message">
            GitHubでの活動、
            <br className="mobile-only" />
            君の技術力を見える形にしよう！
          </p>
        </div>

        <div
          className="button-container"
          style={{ marginTop: '30px', position: 'relative', zIndex: 10 }}
        >
          {/* 中央のメインボタン */}
          <button className="start-button" onClick={handleGitHubLogin}>
            GitHubで始める
          </button>
        </div>
      </main>
    </div>
  );
};

export default Top;
