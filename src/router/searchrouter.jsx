import { lazy, Suspense } from "react";
import Loading from "../components/loading/Loading";

const searchRouter = () => {
  const LazySearchLocation = lazy(
    () => import("../pages/search/SearchLocation"),
  );
  const LazySearchContents = lazy(
    () => import("../pages/search/SearchContents"),
  );
  const LazySearchTrip = lazy(() => import("../pages/search/SearchTrip"));
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
    {
      path: "trip",
      element: (
        <Suspense fallback={<Loading />}>
          <LazySearchTrip />
        </Suspense>
      ),
    },
  ];
};
export default searchRouter;
