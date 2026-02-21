import './Section5.css';
import BoxFrame from '../../BoxFrame/BoxFrame';
import LanguageSkill from '../../LanguageSkill/LanguageSkill';
import type { Language } from '../../../types/card';

type Section5Props = {
  languageSkills: Language[];
};

const getMaxScore = (languages: Language[]) => {
  if (!languages || languages.length === 0) return 0; // デフォルト値
  return Math.max(...languages.map((lang) => lang.char_count), 100); // 最小値は100
};

const Section5 = (props: Section5Props) => {
  return (
    <BoxFrame>
      <div className="skills">
        <h2 className="skills-title">Programming Skills by Language</h2>
        {/* /* TODO: props.languageSkillsをもとにLanguageSkillコンポーネントを動的に生成する */}
        {props.languageSkills?.length
          ? [...props.languageSkills] // 元の配列を破壊しないようにコピー
            .sort((a, b) => b.char_count - a.char_count) // bytes 大きい順にソート
            .map((val, index) => (
              <LanguageSkill
                key={index}
                language={val.name}
                score={val.char_count}
                maxScore={getMaxScore(props.languageSkills)}
              />
            ))
          : null}
      </div>
    </BoxFrame>
  );
};

export default Section5;
