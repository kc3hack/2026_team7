import './Status.css';

interface UpdateBtnProps {
  status: 'initial' | 'updating' | 'updated';
};

const Status = (props: UpdateBtnProps) => {
  return <div>
            <img src="/assets/img/not-updated.png" alt="img1" />
            {/* <img src="/assets/img/updating.gif" alt="img2" />
            <img src="/assets/img/updated.png" alt="img3" /> */}
          </div>;
};

export default Status;
