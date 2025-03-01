// bookingRouter 수정
import { lazy, Suspense } from "react";
import Loading from "../components/loading/Loading";

const bookingRouter = () => {
  const LazyBookingIndex = lazy(() => import("../pages/bookings/BookingIndex"));
  const LazyCompleteBooking = lazy(
    () => import("../pages/bookings/CompleteBooking"),
  );
  const LazyWaiting = lazy(() => import("../pages/bookings/Waiting"));
  return [
    {
      path: "index",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyBookingIndex />
        </Suspense>
      ),
    },
    {
      path: "complete",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyCompleteBooking />
        </Suspense>
      ),
    },
    {
      path: "waiting",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyWaiting />
        </Suspense>
      ),
    },
  ];
};
export default bookingRouter;
