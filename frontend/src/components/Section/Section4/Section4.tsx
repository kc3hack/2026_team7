import './Section4.css';
import BoxFrame from '../../BoxFrame/BoxFrame';
import LabelValue from '../../LabelValue/LabelValue';

const Section4 = () => {
  return (
    <BoxFrame>
      <div className="stats-grid">
        <LabelValue />
        <LabelValue />
        <LabelValue />
        <LabelValue />
      </div>
    </BoxFrame>
  );
};

export default Section4;
