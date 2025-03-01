// bookingRouter 수정
import { lazy, Suspense } from "react";
import Loading from "../../components/loading/Loading";

const LazyMenuIndex = lazy(() => import("../../pages/business/menu/MenuIndex"));
const LazyMenuDetail = lazy(
  () => import("../../pages/business/menu/MenuDetail"),
);
const LazyCreateMenu = lazy(
  () => import("../../pages/business/menu/CreateMenu"),
);
const LazyEditMenu = lazy(() => import("../../pages/business/menu/EdigMenu"));
const menuRouter = () => {
  return [
    {
      path: "/",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyMenuIndex />
        </Suspense>
      ),
    },
    {
      path: "detail",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyMenuDetail />
        </Suspense>
      ),
    },
    {
      path: "create",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyCreateMenu />
        </Suspense>
      ),
    },
    {
      path: "edit",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyEditMenu />
        </Suspense>
      ),
    },
  ];
};
export default menuRouter;
