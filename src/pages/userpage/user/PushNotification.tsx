import { useNavigate } from "react-router-dom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";

const PushNotification = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div>
      <TitleHeaderTs title="알림" icon="back" onClick={() => navigate("/")} />
    </div>
  );
};

export default PushNotification;
