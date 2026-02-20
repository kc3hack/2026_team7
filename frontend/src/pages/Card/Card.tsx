import './Card.css';
import { useState } from 'react';
import { useCardInfo } from '../../hooks/cardInfo';
import BodyFrame from '../../components/BodyFrame/BodyFrame';
import Section1 from '../../components/Section/Section1/Section1';
import Section2 from '../../components/Section/Section2/Section2';
import Section3 from '../../components/Section/Section3/Section3';
import Section4 from '../../components/Section/Section4/Section4';
import Section5 from '../../components/Section/Section5/Section5';
import QR from '../../components/QR/QR'; 
import { useParams,useNavigate } from 'react-router-dom';

const Card = () => {

  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();

  const { user_name } = useParams<{ user_name: string }>();
  
  const { cardInfo, loading, error } = useCardInfo(user_name || ""); // user_nameがundefinedの場合は空文字を渡す
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cardInfo) return <p>No data available</p>;

  const handleUpdateClick = () => {
    if (!user_name) return;
    navigate(`/cards/${cardInfo.user_info.user_name}/update`);
  };

  return (
    <>
      <div>
        <BodyFrame>
          <Section1 
            userName={cardInfo.user_info.display_name} 
            userId={cardInfo.user_info.user_name}
            registeredDate={cardInfo.user_info.github_joined_at}
            title={cardInfo.card_info.alias_title}
            level={cardInfo.card_info.technical_level}
            imageUrl={cardInfo.user_info.avatar_url}
            updatedDate={cardInfo.card_info.last_updated_at}
            onClickQR={() => setShowQR(true)}
            onClickUpdate={() => handleUpdateClick()}
          />
          <Section2 
            aboutMe={cardInfo.user_info.bio}
            Location={cardInfo.user_info.location}
            Company={cardInfo.user_info.company}
          />
          <Section3 
            website={cardInfo.user_info.website}
            social_accounts={cardInfo.user_info.social_accounts}
          />
          <Section4 
            repositories={cardInfo.card_info.stats.repo_count}
            total_bytes={cardInfo.card_info.stats.repo_count}
            activity_grade={cardInfo.card_info.activity_score}
            charisma_grade={cardInfo.card_info.charm_score}
          />
          <Section5 languageSkills={cardInfo.card_info.languages} />
        </BodyFrame>
      </div>
      {/*QR表示*/}
      {showQR && (
        <div className="qr-overlay" onClick={() => setShowQR(false)}>
          <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
            <QR onClose={() => setShowQR(false)} user_name={cardInfo.user_info.user_name} />
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
