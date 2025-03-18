import { lazy, Suspense } from "react";
import Loading from "../../components/loading/Loading";

const LazyPointIndex = lazy(() => import("../../pages/business/point/Index"));
const LazyMakeQr = lazy(() => import("../../pages/business/point/MakeQr"));

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
    {
      path: "qr",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyMakeQr />
        </Suspense>
      ),
    },
  ];
};

export default pointRouter;
