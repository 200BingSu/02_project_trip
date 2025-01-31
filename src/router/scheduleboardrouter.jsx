import { lazy, Suspense } from "react";
import Loading from "../components/loading/Loading";

const scheduleBoardRouter = () => {
  const LazyScheduleBoardIndex = lazy(
    () => import("../pages/scheduleBoard/ScheduleBoardIndex"),
  );
  const LazyScheduleDetail = lazy(
    () => import("../pages/scheduleBoard/ScheduleDetail"),
  );
  const LazySchedulePost = lazy(
    () => import("../pages/scheduleBoard/PostBoard"),
  );
  return [
    {
      path: "index",
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
