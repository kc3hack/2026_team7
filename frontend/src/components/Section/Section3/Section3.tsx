import './Section3.css';
import BoxFrame from '../../BoxFrame/BoxFrame';
import TitleContent from '../../TitleContent/TitleContent';

type Section3Props = {
  website?: string | null;
  social_accounts?: { url: string }[] | null;
};

const Section3 = (props: Section3Props) => {
  return (
    <BoxFrame>
      <div className="pad_box">
        <TitleContent title="Website" content={props.website ?? 'undefined'} />
        {props.social_accounts?.length ? (
          props.social_accounts.map((account, index) => (
            <TitleContent
              key={index}
              title={index === 0 ? 'SNS' : ''}
              content={account.url}
            />
          ))
        ) : (
          <TitleContent title="SNS" content="unknown" />
        )}
      </div>
    </BoxFrame>
  );
};

export default Section3;
