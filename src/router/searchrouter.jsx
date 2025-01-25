import { lazy, Suspense } from "react";
import Loading from "../components/loading/Loading";

const searchRouter = () => {
  const LazySearchLocation = lazy(
    () => import("../pages/search/SearchLocation"),
  );
  const LazySearchContents = lazy(
    () => import("../pages/search/SearchContents"),
  );
  return [
    {
      path: "location",
      element: (
        <Suspense fallback={<Loading />}>
          <LazySearchLocation />
        </Suspense>
      ),
    },
    {
      path: "contents",
      element: (
        <Suspense fallback={<Loading />}>
          <LazySearchContents />
        </Suspense>
      ),
    },
  ];
};
export default searchRouter;
