import { lazy, Suspense } from "react";
import Loading from "../../components/loading/Loading";

const LazyMyPage = lazy(() => import("../../pages/business/mypage/Index"));
const LazyEditUser = lazy(() => import("../../pages/business/mypage/EditUser"));

const myPageRouter = () => {
  return [
    {
      index: true,
      element: (
        <Suspense fallback={<Loading />}>
          <LazyMyPage />
        </Suspense>
      ),
    },
    {
      path: "edit",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyEditUser />
        </Suspense>
      ),
    },
  ];
};

export default myPageRouter;
