import { lazy, Suspense } from "react";
import Loading from "../components/loading/Loading";

const scheduleBoardRouter = () => {
  const LazyScheduleDetail = lazy(
    () => import("../pages/scheduleBoard/scheduleDetail"),
  );
  return [
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
