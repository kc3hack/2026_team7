import './Section4.css';
import BoxFrame from '../../BoxFrame/BoxFrame';
import { LabelValue } from '../../LabelValue/LabelValue';

type Section4Props = {
  repositories: number;
  total_char_count: number;
  activity_grade: number;
  charisma_grade: number;
};

const Section4 = (props: Section4Props) => {
  return (
    <BoxFrame>
      <div className="stats-grid">
        <LabelValue label="Repositories" value={props.repositories} />
        <LabelValue label="Total Bytes" value={props.total_char_count} />
        <LabelValue label="Activity Grade" value={props.activity_grade} />
        <LabelValue label="Charisma Grade" value={props.charisma_grade} />
      </div>
    </BoxFrame>
  );
};

export default Section4;
