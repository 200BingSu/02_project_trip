import { lazy, Suspense } from "react";
import Loading from "../../components/loading/Loading.jsx";

const searchRouter = () => {
  const LazySearchLocation = lazy(
    () => import("../../pages/user/search/SearchLocation.jsx"),
  );
  const LazySearchContents = lazy(
    () => import("../../pages/user/search/SearchContents.jsx"),
  );
  const LazySearchTrip = lazy(
    () => import("../../pages/user/search/SearchTrip.jsx"),
  );
  const LazySearchStrf = lazy(
    () => import("../../pages/user/search/SearchStrf.jsx"),
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
