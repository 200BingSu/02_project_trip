// bookingRouter 수정
import { lazy, Suspense } from "react";
import Loading from "../../components/loading/Loading";

const LazyCouponIndex = lazy(
  () => import("../../pages/business/coupon/CouponIndex"),
);
const LazyCreateCoupon = lazy(
  () => import("../../pages/business/coupon/CreateCoupon"),
);
const LazyEditCoupon = lazy(
  () => import("../../pages/business/coupon/EditCoupon"),
);

const couponRouter = () => {
  return [
    {
      path: "/",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyCouponIndex />
        </Suspense>
      ),
    },
    {
      path: "create",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyCreateCoupon />
        </Suspense>
      ),
    },
    {
      path: "edit",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyEditCoupon />
        </Suspense>
      ),
    },
  ];
};
export default couponRouter;
