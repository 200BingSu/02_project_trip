import { lazy, Suspense } from "react";
import Loading from "../../components/loading/Loading";

const scheduleBoardRouter = () => {
  const LazyScheduleBoardIndex = lazy(
    () => import("../../pages/userpage/scheduleboard/Index"),
  );
  const LazyScheduleDetail = lazy(
    () => import("../../pages/userpage/scheduleboard/ScheduleDetail"),
  );
  const LazySchedulePost = lazy(
    () => import("../../pages/userpage/scheduleboard/PostBoard"),
  );
  return [
    {
      index: true,
      element: (
        <Suspense fallback={<Loading />}>
          <LazyScheduleBoardIndex />
        </Suspense>
      ),
    },
    {
      path: "scheduleDetail",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyScheduleDetail />
        </Suspense>
      ),
    },
    {
      path: "schedulePost",
      element: (
        <Suspense fallback={<Loading />}>
          <LazySchedulePost />
        </Suspense>
      ),
    },
  ];
};
export default scheduleBoardRouter;
