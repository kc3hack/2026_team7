import './LanguageSkill.css';

const LanguageSkill = () => {
  return  <div className="skill">
            <div className="skill-left">
              <img alt="Language" className="skill-icon"></img>
              <span className="skill-name">Language-icon</span>
            </div>

            <div className="skill-bar">
              <div className="skill-fill"></div>
            </div>

            <div className="skill-score">110,00</div>
          </div>;
};

export default LanguageSkill;
