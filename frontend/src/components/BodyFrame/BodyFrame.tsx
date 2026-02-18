import './BodyFrame.css';

type FrameProps = {
  children: React.ReactNode;
};

const BodyFrame = (props: FrameProps) => {
  return <div className="frame">{props.children}</div>;
};

export default BodyFrame;
