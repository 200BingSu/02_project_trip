import { lazy, Suspense } from "react";
import Loading from "../../components/loading/Loading";

const contentsRouter = () => {
  const LazyContentsIndex = lazy(
    () => import("../../pages/userpage/contents/ContentIndex"),
  );
  const LazyPostReview = lazy(
    () => import("../../pages/userpage/contents/PostReview"),
  );
  // const LazyPostReview = lazy(() => import("../../pages/contents/PostReview"));
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
