import React from 'react';
import './Section2.css';
import BoxFrame from '../../BoxFrame/BoxFrame';
import TitleContent from '../../TitleContent/TitleContent';

type Section2Props = {
  aboutMe?: string;
  Location?: string;
  Company?: string;
};

const Section2 = (props: Section2Props) => {
  // データが空（undefined, null, ""）の時に「なし」を表示する
  const aboutMeText = props.aboutMe || "なし";
  const locationText = props.Location || "なし";
  const companyText = props.Company || "なし";

  return (
    <BoxFrame>
      <div className="section2-inner">
        {/* 自己紹介エリア */}
        <TitleContent 
          title="About Me" 
          content={aboutMeText} 
        />
        
        {/* 場所と所属のエリア */}
        <div className="info-row">
          <TitleContent 
            title="Location" 
            content={locationText} 
          />
          <TitleContent 
            title="Company" 
            content={companyText} 
          />
        </div>
      </div>
    </BoxFrame>
  );
};

export default Section2;