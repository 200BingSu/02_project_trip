import { Outlet, useLocation, useNavigate } from "react-router-dom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";

const Coupon = (): JSX.Element => {
  // 쿼리

  // useNavigate
  const navigate = useNavigate();
  const navigateToHome = () => {
    navigate("/business/mypage");
  };
  const navigateToCoupon = () => {
    navigate(-1);
  };

  // useLocation
  const location = useLocation();
  const pathname = location.pathname;
  console.log(pathname);
  return (
    <div className="min-h-screen">
      <TitleHeaderTs
        title="리뷰 관리"
        onClick={
          pathname === "/business/coupon" ? navigateToHome : navigateToCoupon
        }
        icon={pathname === "/business/coupon" ? "close" : "back"}
      />
      <Outlet />
    </div>
  );
};

export default Coupon;
