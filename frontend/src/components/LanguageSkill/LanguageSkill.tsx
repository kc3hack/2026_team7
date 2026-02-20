import React from 'react';
import './LanguageSkill.css';
import getIconUrl from '../../utils/getIcon';

type Props = {
  language: string;
  score: number;
  maxScore?: number;
};

const LanguageSkill = (props: Props) => {
  const { language, score, maxScore = 100 } = props;

  // 0%を下回らず、100%を超えないように計算（ガード処理）
  const percentage = Math.min(Math.max(0, (score / maxScore) * 100), 100);

  return (
    <div className="skill">
      <div className="skill-left">
        <img 
          alt={language} 
          className="skill-icon" 
          src={getIconUrl(language.toLowerCase())} 
        />
        <span className="skill-name">{language}</span>
      </div>

      <div className="skill-bar">
        {/* スコアに応じた幅を適用。transitionにより動きが滑らかになります */}
        <div 
          className="skill-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="skill-score">
        {score.toLocaleString()}
      </div>
    </div>
  );
};

export default LanguageSkill;