import './Update.css';
import BoxFrame from '../../components/BoxFrame/BoxFrame';
import Status from '../../components/Status/Status';
import UpdateBtn from '../../components/UpdateBtn/UpdateBtn';

const Update = () => {
  return (
    <div className="page">
      <BoxFrame>
        <div className="container_outer">
          <h1 className="title_update">Skill Update</h1>
          <Status status="initial" />
          <p className="user-id">ID : yutota13</p>
          <UpdateBtn status="initial" onClick={() => console.log('Update button clicked')} />
        </div>
      </BoxFrame>
    </div>
  );
};

export default Update;
