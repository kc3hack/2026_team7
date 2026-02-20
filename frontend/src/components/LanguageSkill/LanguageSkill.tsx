import React from 'react';
import './LanguageSkill.css';

type LanguageSkillProps = {
  languageName: string;
  level: number;
};

const LanguageSkill = ({ languageName, level }: LanguageSkillProps) => {
  // ★ ここがポイント：値を 0〜100 の間に強制する
  // Math.max(0, level) でマイナスを0にし、Math.min(..., 100) で100超えを100にする
  const clampedLevel = Math.min(Math.max(0, level), 100);

  return (
    <div className="language-skill-container">
      <div className="skill-info">
        <span className="language-name">{languageName}</span>
        {/* 表示する数字は元の値を使うか、補正後の値を使うか選べますが、
            バーと合わせるなら補正後の数字を出すのが親切です */}
        <span className="skill-percentage">{clampedLevel}%</span>
      </div>
      <div className="progress-bar-bg">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${clampedLevel}%` }}
        ></div>
      </div>
    </div>
  );
};

export default LanguageSkill;