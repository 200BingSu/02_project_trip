import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import CouponForm from "../../../components/business/coupon/CouponForm";
import StrfInfo from "../../../components/business/StrfInfo";

const EditCoupon = (): JSX.Element => {
  // useNavigate
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const pathname = location.pathname;
  const formType = pathname.includes("edit") ? "edit" : "create";
  console.log(formType);
  const couponId = Number(searchParams.get("couponId"));

  const navigateToCouponList = () => {
    navigate("/business/coupon");
  };
  return (
    <div>
      <TitleHeaderTs
        title="쿠폰 관리"
        icon="back"
        onClick={navigateToCouponList}
      />
      <StrfInfo name="업체 이름" id="1234" category="숙소" />
      <CouponForm formType={formType} couponId={couponId} />
    </div>
  );
};

export default EditCoupon;
