import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import CouponForm from "../../../components/business/coupon/CouponForm";
import StrfInfo from "../../../components/business/StrfInfo";
import { ICoupon } from "../../../types/interface";

const EditCoupon = (): JSX.Element => {
  // useNavigate

  const location = useLocation();
  // 쿼리
  const [searchParams] = useSearchParams();
  const strfId = Number(searchParams.get("strfId"));
  const couponId = Number(searchParams.get("couponId"));
  const title = searchParams.get("title") as string;
  const discountPer = Number(searchParams.get("discountPer"));
  const expiredAt = searchParams.get("expiredAt") as string;
  const distributeAt = searchParams.get("distributeAt") as string;

  const [couponData, setCouponData] = useState<ICoupon | null>(null);

  const pathname = location.pathname;
  const formType = pathname.includes("edit") ? "edit" : "create";
  console.log(formType);

  useEffect(() => {
    if (title && discountPer && expiredAt && distributeAt) {
      setCouponData({
        title: title,
        discountPer: Number(discountPer),
        expiredAt: expiredAt,
        distributeAt: distributeAt,
      });
    }
  }, []);

  return (
    <div>
      <StrfInfo />
      <CouponForm
        formType={formType}
        strfId={strfId}
        couponId={couponId}
        couponData={couponData as ICoupon}
      />
    </div>
  );
};

export default EditCoupon;
