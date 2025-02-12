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
  const LazySearchStrf = lazy(() => import("../pages/search/SearchStrf"));
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
    {
      path: "strf",
      element: (
        <Suspense fallback={<Loading />}>
          <LazySearchStrf />
        </Suspense>
      ),
    },
  ];
};
export default searchRouter;
