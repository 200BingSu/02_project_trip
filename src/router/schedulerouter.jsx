import { lazy, Suspense } from "react";
import Loading from "../components/loading/Loading";

const scheduleRouter = () => {
  const LazyScheduleIndex = lazy(
    () => import("../pages/schedule/ScheduleIndex"),
  );
  // const LazyRegionList = lazy(() => import("../pages/schedule/RegionList"));
  return [
    {
      path: "index",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyScheduleIndex />
        </Suspense>
      ),
    },
    // {
    //   path: "regionlist",
    //   element: (
    //     <Suspense fallback={<Loading />}>
    //       <LazyRegionList />
    //     </Suspense>
    //   ),
    // },
  ];
};
export default scheduleRouter;
