import './Card.css';
import BodyFrame from '../../components/BodyFrame/BodyFrame';
import Section1 from '../../components/Section/Section1/Section1';
import Section2 from '../../components/Section/Section2/Section2';
import Section3 from '../../components/Section/Section3/Section3';
import Section4 from '../../components/Section/Section4/Section4';
import Section5 from '../../components/Section/Section5/Section5';

const Card = () => {
  return (
    <div>
      <BodyFrame>
        <Section1 />
        <Section2 />
        <Section3 />
        <Section4 />
        <Section5 />   
      </BodyFrame>
    </div>
  );
};

export default Card;
