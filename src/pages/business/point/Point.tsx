import { Outlet, useLocation, useNavigate } from "react-router-dom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";

const Point = () => {
  //router
  const navigate = useNavigate();
  const navigateToBack = () => {
    pathname === "/business/point"
      ? navigate("/business/mypage")
      : navigate(-1);
  };
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <div>
      <TitleHeaderTs
        title="포인트 관리"
        icon={pathname === "/business/point" ? "close" : "back"}
        onClick={navigateToBack}
      />
      <Outlet />
    </div>
  );
};

export default Point;
