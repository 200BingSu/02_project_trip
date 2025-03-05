import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import CouponForm from "../../../components/business/coupon/CouponForm";

const CreateCoupon = (): JSX.Element => {
  // useNavigate
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const strfId = Number(searchParams.get("strfId"));
  const pathname = location.pathname;
  const formType = pathname.includes("edit") ? "edit" : "create";
  console.log(formType);
  const couponId = Number(searchParams.get("couponId"));

  const navigateToBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <TitleHeaderTs title="쿠폰 관리" icon="back" onClick={navigateToBack} />
      <CouponForm formType={formType} couponId={couponId} strfId={strfId} />
    </div>
  );
};

export default CreateCoupon;
