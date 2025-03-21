import { Outlet, useLocation, useNavigate } from "react-router-dom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import StrfInfo from "../../../components/business/StrfInfo";

const Booking = (): JSX.Element => {
  // 쿼리스트링
  // useNavigate
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;

  const navigateToBack = () => {
    pathName === "/business/booking"
      ? navigate("/business/mypage")
      : navigate(-1);
  };
  return (
    <div>
      <TitleHeaderTs
        title="예약 관리"
        onClick={navigateToBack}
        icon={pathName === "/business/booking" ? "close" : "back"}
      />
      <StrfInfo />
      <Outlet />
    </div>
  );
};

export default Booking;
