import { lazy, Suspense } from "react";
import Loading from "../components/loading/Loading";

const scheduleBoardRouter = () => {
  const LazyScheduleBoardIndex = lazy(
    () => import("../pages/scheduleboard/scheduleBoardIndex"),
  );
  const LazyScheduleDetail = lazy(
    () => import("../pages/scheduleboard/scheduleDetail"),
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
  ];
};
export default scheduleBoardRouter;
