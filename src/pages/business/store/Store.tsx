import { Outlet, useNavigate } from "react-router-dom";
import StrfInfo from "../../../components/business/StrfInfo";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";

const Store = (): JSX.Element => {
  //navigate
  const navigate = useNavigate();
  const navigateToHome = () => {
    navigate("/business");
  };
  return (
    <div className="min-h-screen">
      <TitleHeaderTs title="업체 관리" onClick={navigateToHome} />
      <StrfInfo />
      <Outlet />
    </div>
  );
};

export default Store;
