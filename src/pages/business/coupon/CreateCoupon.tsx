import { useLocation, useSearchParams } from "react-router-dom";
import CouponForm from "../../../components/business/coupon/CouponForm";

const CreateCoupon = (): JSX.Element => {
  // useNavigate

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const strfId = Number(searchParams.get("strfId"));
  const pathname = location.pathname;
  const formType = pathname.includes("edit") ? "edit" : "create";
  console.log(formType);
  const couponId = Number(searchParams.get("couponId"));

  return (
    <div>
      <CouponForm formType={formType} couponId={couponId} strfId={strfId} />
    </div>
  );
};

export default CreateCoupon;
