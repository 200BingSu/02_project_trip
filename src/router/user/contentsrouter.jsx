import { lazy, Suspense } from "react";
import Loading from "../../components/loading/Loading";

const contentsRouter = () => {
  const LazyContentsIndex = lazy(
    () => import("../../pages/user/contents/ContentIndex"),
  );
  const LazyPostReview = lazy(
    () => import("../../pages/user/contents/PostReview"),
  );
  return [
    {
      path: "index",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyContentsIndex />
        </Suspense>
      ),
    },
    {
      path: "postreview",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyPostReview />
        </Suspense>
      ),
    },
  ];
};
export default contentsRouter;
