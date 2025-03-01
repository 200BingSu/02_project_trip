// bookingRouter 수정
import { lazy, Suspense } from "react";
import Loading from "../../components/loading/Loading";

const LazyReviewIndex = lazy(
  () => import("../../pages/business/review/ReviewIndex"),
);
const LazyEditReview = lazy(
  () => import("../../pages/business/review/EditReview"),
);
const reviewRouter = () => {
  return [
    {
      path: "/",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyReviewIndex />
        </Suspense>
      ),
    },
    {
      path: "edit",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyEditReview />
        </Suspense>
      ),
    },
  ];
};
export default reviewRouter;
