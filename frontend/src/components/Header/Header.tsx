import React from 'react';
import './Header.css';

export const Header: React.FC = () => {
  // ★ GitHubログイン用のリダイレクト関数を追加
  const handleGitHubLogin = () => {
    window.location.href = '/auth/github/login';
  };

  return (
    <header className="header fixed-header">
      <div className="header-container">
        <div className="header-logo">
          <span className="logo-placeholder">Logo</span>
        </div>
        <div className="header-nav">
          {/* ★ onClick を追加して関数を呼び出す */}
          <button
            className="login-button"
            onClick={handleGitHubLogin}
            style={{ cursor: 'pointer' }}
          >
            GitHubでログイン
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
