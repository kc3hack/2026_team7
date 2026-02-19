import './Section3.css';
import BoxFrame from '../../BoxFrame/BoxFrame';
import TitleContent from '../../TitleContent/TitleContent';

type Section3Props = {
  website?: string;
  social_accounts?: string[];
};

const Section3 = (props: Section3Props) => {
  return (
    <BoxFrame>
      <div className="pad_box">
        <TitleContent title="sample" content="サンプル文章あああああああああああ" />
        <TitleContent title="sample2" content="サンプル文章あああああああああああ" />
        <TitleContent title="" content='サンプル文章あああ'></TitleContent>
        <TitleContent title="" content='サンプル文章あああ'></TitleContent>
        <TitleContent title="" content='サンプル文章あああ'></TitleContent>
      </div>
    </BoxFrame>
  );
};

export default Section3;
