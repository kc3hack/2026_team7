import './Card.css';
import BodyFrame from '../../components/BodyFrame/BodyFrame';
import Section1 from '../../components/Section/Section1/Section1';
import Section2 from '../../components/Section/Section2/Section2';
import Section3 from '../../components/Section/Section3/Section3';
import Section4 from '../../components/Section/Section4/Section4';
import Section5 from '../../components/Section/Section5/Section5';
import { useState } from 'react';
import QR from '../../components/QR/QR'; 


const Card = () => {
  
  const [showQR, setShowQR] = useState(false);
  return (
    <>
      <div>
        <BodyFrame>
          <Section1 
            userName="ゆーと" 
            userId="12345678"
            registeredDate="2019/03/10"
            title="スーパーエンジニア"
            level={125}
            imageUrl="https://placehold.jp/150x150.png"
            updatedDate="2026.02.17 05:43:32"
            onClickQR={() => setShowQR(true)}
          />
          <Section2 />
          <Section3 />
          <Section4 />
          <Section5 />   
        </BodyFrame>
      </div>
      {/*QR表示*/}
      {showQR && (
        <div className="qr-overlay" onClick={() => setShowQR(false)}>
          <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
            <QR onClose={() => setShowQR(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
