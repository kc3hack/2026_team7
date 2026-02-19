import './Section2.css';
import BoxFrame from '../../BoxFrame/BoxFrame';
import TitleContent from '../../TitleContent/TitleContent';

const Section2 = () => {
  return (
    <BoxFrame>
      <div className="pad_box">
        <TitleContent title="サンプル" content="サンプル文章あああああああああああ" />
        <TitleContent title="サンプル" content="サンプル文章あああああああああああ" />
        <TitleContent title="サンプル" content="サンプル文章あああああああああああ" />
      </div>
    </BoxFrame>
  );
};

export default Section2;