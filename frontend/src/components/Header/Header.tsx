import React from 'react';
import './Header.css';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <span className="logo-placeholder">Logo</span>
        </div>
        <div className="header-nav">
          <button className="login-button">GitHubでログイン</button>
        </div>
      </div>
    </header>
  );
};
export default Header;