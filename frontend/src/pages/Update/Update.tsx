import './Update.css';
import BoxFrame from '../../components/BoxFrame/BoxFrame';
import Status from '../../components/Status/Status';
import UpdateBtn from '../../components/UpdateBtn/UpdateBtn';

const Update = () => {
  return (
    <div className="page">
      <BoxFrame>
        <div className="container">
          <h1 className="title">Skill Update</h1>
          <Status />
          <p className="user-id">ID : yutota13</p>
          <UpdateBtn />
        </div>
      </BoxFrame>
    </div>
  );
};

export default Update;
