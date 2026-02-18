import './Status.css';
import img1 from "../assets/img/not-updated.png";
import img2 from "../assets/img/updating.png";
import img3 from "../assets/img/updated.png";

const Status = () => {
  return <div>
            <img src={img1} alt="img1" />
            <img src={img2} alt="img2" />
            <img src={img3} alt="img3" />
          </div>;
};

export default Status;
