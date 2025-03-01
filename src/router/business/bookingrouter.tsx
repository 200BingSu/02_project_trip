// bookingRouter 수정
import { lazy, Suspense } from "react";
import Loading from "../../components/loading/Loading";

const LazyBookingIndex = lazy(
  () => import("../../pages/business/booking/BookindIndex"),
);
const LazyBookingDetail = lazy(
  () => import("../../pages/business/booking/BookingDetail"),
);
const bookingRouter = () => {
  return [
    {
      path: "/",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyBookingIndex />
        </Suspense>
      ),
    },
    {
      path: "detail",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyBookingDetail />
        </Suspense>
      ),
    },
  ];
};
export default bookingRouter;
