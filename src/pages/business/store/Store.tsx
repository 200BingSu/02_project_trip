import { Outlet, useNavigate } from "react-router-dom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";

const Store = (): JSX.Element => {
  //navigate
  const navigate = useNavigate();
  const navigateToHome = () => {
    navigate("/business/mypage");
  };
  return (
    <div className="min-h-screen">
      <TitleHeaderTs title="업체 관리" onClick={navigateToHome} icon="close" />
      <Outlet />
    </div>
  );
};

export default Store;
