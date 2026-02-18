import './TitleContent.css';

type Props = {
  title: string;
  content: string;
};

const TitleContent = (props: Props) => {
  return   <div className="container">
    <div className="about-card">
      <h2 className="about-title">location</h2>
      <p className="about-text">
        サンプルテキスト
      </p>
    </div>
  </div>;
};

export default TitleContent;
