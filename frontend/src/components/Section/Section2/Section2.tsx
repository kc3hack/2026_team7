import './Section2.css';
import BoxFrame from '../../BoxFrame/BoxFrame';
import TitleContent from '../../TitleContent/TitleContent';

const Section2 = () => {
  return (
    <BoxFrame>
      <div className="pad_box">
        <TitleContent title="sample" content="サンプル文章あああああああああああ" />
        <TitleContent title="sample2" content="サンプル文章あああああああああああ" />
        <TitleContent title="sample3" content="サンプル文章あああああああああああ" />
      </div>
    </BoxFrame>
  );
};

export default Section2;