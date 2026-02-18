import './Section5.css';
import BoxFrame from '../../BoxFrame/BoxFrame';
import LanguageSkill from '../../LanguageSkill/LanguageSkill';

const Section5 = () => {
  return (      
    <BoxFrame>
      <div className="skills">
        <h2 className="skills-title">
          Programming Skills by Language
        </h2>

        <LanguageSkill />
        <LanguageSkill  />
        <LanguageSkill  />
        <LanguageSkill  />
        <LanguageSkill  />
        <LanguageSkill  />
      </div>
    </BoxFrame>
  );
};

export default Section5;
