import { lazy, Suspense } from "react";
import Loading from "../components/loading/Loading";

const scheduleRouter = () => {
  const LazyRegionList = lazy(() => import("../pages/schedule/RegionList"));
  return [
    {
      path: "regionlist",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyRegionList />
        </Suspense>
      ),
    },
  ];
};
export default scheduleRouter;
