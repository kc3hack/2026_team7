import './TitleContent.css';

type TitleContentProps = {
  title: string;
  content: string;
};

const TitleContent = ({ title, content }: TitleContentProps) => {
  // 文字列が http:// または https:// から始まるか判定
  const isUrl = content.startsWith('http://') || content.startsWith('https://');

  return (
    <div className="title-content-container">
      <h3 className="title-label">{title}</h3>
      <div className="content-body">
        {isUrl ? (
          <a 
            href={content} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="content-link"
          >
            {content}
          </a>
        ) : (
          <p className="content-text">{content}</p>
        )}
      </div>
    </div>
  );
};

export default TitleContent;