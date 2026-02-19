import './TitleContent.css';

type Props = {
  title: string;
  content: string;
};

const TitleContent = (props: Props) => {
  return   <div className="container">
    <div className="about-card">
      <h2 className="about-title">{props.title}</h2>
      <p className="about-text">
        {props.content}
      </p>
    </div>
  </div>;
};

export default TitleContent;
