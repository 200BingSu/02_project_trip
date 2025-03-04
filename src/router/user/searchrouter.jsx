import { lazy, Suspense } from "react";
import Loading from "../../components/loading/Loading.jsx";

const searchRouter = () => {
  const LazySearchLocation = lazy(
    () => import("../../pages/userpage/search/SearchLocation.jsx"),
  );
  const LazySearchContents = lazy(
    () => import("../../pages/userpage/search/SearchContents.jsx"),
  );
  const LazySearchTrip = lazy(
    () => import("../../pages/userpage/search/SearchTrip.jsx"),
  );
  const LazySearchStrf = lazy(
    () => import("../../pages/userpage/search/SearchStrf.jsx"),
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
