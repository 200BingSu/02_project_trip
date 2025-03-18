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
    () => import("../../pages/userpage/search/SearchInTrip.tsx"),
  );
  const LazySearchStrf = lazy(
    () => import("../../pages/userpage/search/SearchAfter.jsx"),
  );
  const LazySearchBefore = lazy(
    () => import("../../pages/userpage/search/SearchBefore.jsx"),
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
      path: "before",
      element: (
        <Suspense fallback={<Loading />}>
          <LazySearchBefore />
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
