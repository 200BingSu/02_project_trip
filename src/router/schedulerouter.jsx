import { lazy, Suspense } from "react";
import Loading from "../components/loading/Loading";

const scheduleRouter = () => {
  const LazyScheduleIndex = lazy(
    () => import("../pages/schedule/ScheduleIndex"),
  );
  const LazySelectDays = lazy(() => import("../pages/schedule/SelectDays"));
  return [
    {
      path: "index",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyScheduleIndex />
        </Suspense>
      ),
    },
    {
      path: "days",
      element: (
        <Suspense fallback={<Loading />}>
          <LazySelectDays />
        </Suspense>
      ),
    },
  ];
};
export default scheduleRouter;
