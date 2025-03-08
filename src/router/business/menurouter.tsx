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
const LazyEditMenu = lazy(() => import("../../pages/business/menu/EditMenu"));
const menuRouter = () => {
  return [
    {
      index: true,
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
      path: "edit",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyEditMenu />
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
  ];
};
export default menuRouter;
