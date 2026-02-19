import './Section4.css';
import BoxFrame from '../../BoxFrame/BoxFrame';
import { LabelValue } from '../../LabelValue/LabelValue';

type Section4Props = {
  repositories : number;
  total_bytes : number;
  activity_grade : number;
  charisma_grade : number;
};

const Section4 = (props: Section4Props) => {
  return (
    <BoxFrame>
      <div className="stats-grid">
        <LabelValue label="Repositories" value="68" />
        <LabelValue label="Repositories" value="68" />
        <LabelValue label="Repositories" value="68" />
        <LabelValue label="Repositories" value="68" />
      </div>
    </BoxFrame>
  );
};

export default Section4;
