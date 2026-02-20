import './LanguageSkill.css';
import getIconUrl from '../../utils/getIcon';

type Props = {
  language: string;
  score: number;
  maxScore?: number;
};

const LanguageSkill = (props: Props) => {
  const { language, score, maxScore = 100 } = props;

  // ★ 名前から固有の色（Hue）を計算する関数
  const getPersistentColor = (text: string) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      // 文字コードを使って数字を生成
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    // 360度の中で色を決定
    const hue = Math.abs(hash % 360);
    // 彩度70%、輝度55%に固定することで「黒くならない」「鮮やか」を両立
    return `hsl(${hue}, 70%, 55%)`;
  };

  const mainColor = getPersistentColor(language);
  const percentage = Math.min(Math.max(0, (score / maxScore) * 100), 100);

  return (
    <div className="skill">
      <div className="skill-left">
        <img 
          alt={language} 
          className="skill-icon" 
          src={getIconUrl(language)} 
        />
        <span className="skill-name">{language}</span>
      </div>

      <div className="skill-bar">
        <div 
          className="skill-fill" 
          style={{ 
            width: `${percentage}%`,
            backgroundColor: mainColor 
          }}
        >
          {/* CSSの::afterがこの色を継承して光る線になります */}
        </div>
      </div>

      <div className="skill-score">
        {score.toLocaleString()}
      </div>
    </div>
  );
};

export default LanguageSkill;