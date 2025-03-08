import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";

const Coupon = (): JSX.Element => {
  // 쿼리
  const [searchParams] = useSearchParams();
  const strfId = Number(searchParams.get("strfId"));
  // useNavigate
  const navigate = useNavigate();
  const navigateToHome = () => {
    navigate("/business");
  };
  const navigateToCoupon = () => {
    navigate(`/business/coupon?strfId=${strfId}`);
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
      />
      <Outlet />
    </div>
  );
};

export default Coupon;
