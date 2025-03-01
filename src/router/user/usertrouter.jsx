import { lazy, Suspense } from "react";
import Loading from "../../components/loading/Loading";

const usertrouter = () => {
  const LazyUserIndex = lazy(() => import("../../pages/user/user/UserIndex"));
  const LazyUserEdit = lazy(() => import("../../pages/user/user/UserEdit"));
  const LazyUserTrips = lazy(() => import("../../pages/user/user/UserTrips"));
  const LazyUserRecentList = lazy(
    () => import("../../pages/user/user/UserRecentList"),
  );
  const LazyUserBooking = lazy(
    () => import("../../pages/user/user/UserBooking"),
  );
  const LazyUserWishList = lazy(
    () => import("../../pages/user/user/UserWishList"),
  );
  const LazyUserrRview = lazy(() => import("../../pages/user/user/UserrRview"));
  const LazyUserCoupon = lazy(() => import("../../pages/user/user/UserCoupon"));
  const LazyUserTrip = lazy(() => import("../../pages/user/user/UserTrip"));
  const LazyFindPw = lazy(() => import("../../pages/user/user/FindPw"));
  const LazyChangePw = lazy(() => import("../../pages/user/user/ChangePw"));

  return [
    {
      path: "index",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyUserIndex />
        </Suspense>
      ),
    },
    {
      path: "useredit",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyUserEdit />
        </Suspense>
      ),
    },
    {
      path: "usertrips",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyUserTrips />
        </Suspense>
      ),
    },
    {
      path: "recentlist",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyUserRecentList />
        </Suspense>
      ),
    },
    {
      path: "userbooking",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyUserBooking />
        </Suspense>
      ),
    },
    {
      path: "userwishlist",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyUserWishList />
        </Suspense>
      ),
    },
    {
      path: "userreview",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyUserrRview />
        </Suspense>
      ),
    },
    {
      path: "usercoupon",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyUserCoupon />
        </Suspense>
      ),
    },
    {
      path: "usertrip",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyUserTrip />
        </Suspense>
      ),
    },
    {
      path: "findpw",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyFindPw />
        </Suspense>
      ),
    },
    {
      path: "changepw",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyChangePw />
        </Suspense>
      ),
    },
  ];
};

export default usertrouter;
