import { lazy, Suspense } from "react";
import Loading from "../../components/loading/Loading";

const scheduleRouter = () => {
  const LazyScheduleIndex = lazy(
    () => import("../../pages/userpage/schedule/ScheduleIndex"),
  );
  const LazySelectDays = lazy(
    () => import("../../pages/userpage/schedule/SelectDays"),
  );
  // const LazySelectDays = lazy(() => import("../../pages/schedule/SelectDays"));
  const LazyCalculation = lazy(
    () => import("../../pages/userpage/calculation/Calculation"),
  );
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
    {
      path: "calculation",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyCalculation />
        </Suspense>
      ),
    },
  ];
};
export default scheduleRouter;
