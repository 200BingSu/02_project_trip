import { lazy, Suspense } from "react";
import Loading from "../../components/loading/Loading";

const LazyPointIndex = lazy(() => import("../../pages/business/point/Index"));

const pointRouter = () => {
  return [
    {
      index: true,
      element: (
        <Suspense fallback={<Loading />}>
          <LazyPointIndex />
        </Suspense>
      ),
    },
  ];
};

export default pointRouter;
