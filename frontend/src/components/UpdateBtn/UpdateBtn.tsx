import React from 'react';
import './UpdateBtn.css';

interface UpdateBtnProps {
  status: 'initial' | 'updating' | 'updated';
  onClick?: () => void;
}

const UpdateBtn: React.FC<UpdateBtnProps> = ({ status, onClick }) => {
  // スライド6, 7は「スキルを更新」、8は「閉じる」
  const buttonText = status === 'updated' ? '閉じる' : 'スキルを更新';

  return (
    <button 
      className={`update-main-button ${status}`}
      onClick={onClick}
      disabled={status === 'updating'}
    >
      {buttonText}
    </button>
  );
};

export default UpdateBtn;