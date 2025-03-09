import { Outlet } from "react-router-dom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import StrfInfo from "../../../components/business/StrfInfo";

const Store = (): JSX.Element => {
  return (
    <div className="min-h-screen">
      <TitleHeaderTs title="업체 관리" />
      <StrfInfo />
      <Outlet />
    </div>
  );
};

export default Store;
