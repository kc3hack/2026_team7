import './Section5.css';
import BoxFrame from '../../BoxFrame/BoxFrame';
import LanguageSkill from '../../LanguageSkill/LanguageSkill';
import type { Language } from '../../../types/card';

type Section5Props = {
  languageSkills: Language[];
};

const Section5 = (props: Section5Props) => {
  return (      
    <BoxFrame>
      <div className="skills">
        <h2 className="skills-title">
          Programming Skills by Language
        </h2>
        {/* /* TODO: props.languageSkillsをもとにLanguageSkillコンポーネントを動的に生成する */ }
        <LanguageSkill language='JavaScript' score={90} maxScore={100}></LanguageSkill>
      </div>
    </BoxFrame>
  );
};

export default Section5;
