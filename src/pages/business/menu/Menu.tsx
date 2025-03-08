import { Outlet } from "react-router-dom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";

const Menu = (): JSX.Element => {
  return (
    <div>
      <TitleHeaderTs title="메뉴 관리" />
      <Outlet />
    </div>
  );
};

export default Menu;
