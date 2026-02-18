import React from 'react';
import Header from '../../components/Header/Header'; // Headerへのパスを合わせる
import './Top.css';

const Top: React.FC = () => {
  return (
    <div className="top-page-wrapper">
      {/* Topページの中にヘッダーを組み込む */}
      <Header /> 
      
      <main className="hero-section">
        <h1 className="product-title">Product Name</h1>
        <div className="message-area">
          <p className="main-message">君のコードが、君の武器になる。</p>
          <p className="sub-message">
            GitHubでの活動、君の技術力を見える形にしよう！
          </p>
        </div>
        <button className="start-button">
          GitHubで始める
        </button>
      </main>
    </div>
  );
};

export default Top;