import { lazy, Suspense } from "react";
import Loading from "../../components/loading/Loading";

const LazyIndex = lazy(() => import("../../pages/common/report/Index"));

const reportRouter = () => {
  return [
    {
      index: true,
      element: (
        <Suspense fallback={<Loading />}>
          <LazyIndex />
        </Suspense>
      ),
    },
  ];
};
export default reportRouter;
