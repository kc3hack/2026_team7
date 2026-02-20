import './Update.css';
import { useUpdateStatus } from '../../hooks/update';
import BoxFrame from '../../components/BoxFrame/BoxFrame';
import Status from '../../components/Status/Status';
import UpdateBtn from '../../components/UpdateBtn/UpdateBtn';

const Update = () => {
  const user_name = "test";

  const { status, loading, error } = useUpdateStatus();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="page">
      <BoxFrame>
        <div className="container_outer">
          <h1 className="title_update">Skill Update</h1>

          {/* APIから取得したstatusを渡す */}
          <Status status={status?.status ? "updated" : "initial"} />

          <p className="user-id">ID : {user_name}</p>

          <UpdateBtn
            status={status?.status ? "updated" : "initial"}
            onClick={() => console.log('Update button clicked')}
          />
        </div>
      </BoxFrame>
    </div>
  );
};

export default Update;