import './BoxFrame.css';

type BoxFrameProps = {
  children: React.ReactNode;
};

const BoxFrame = ({ children }: BoxFrameProps) => {
  return <div className="box_area">{children}</div>;
};

export default BoxFrame;
