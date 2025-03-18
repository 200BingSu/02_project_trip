import { lazy, Suspense } from "react";
import Loading from "../../components/loading/Loading";

const usertrouter = () => {
  const LazyUserIndex = lazy(
    () => import("../../pages/userpage/user/UserIndex"),
  );
  const LazyUserEdit = lazy(() => import("../../pages/userpage/user/UserEdit"));
  const LazyPushNotification = lazy(
    () => import("../../pages/userpage/user/PushNotification"),
  );
  const LazyUserTrips = lazy(
    () => import("../../pages/userpage/user/UserTrips"),
  );
  const LazyUserRecentList = lazy(
    () => import("../../pages/userpage/user/UserRecentList"),
  );
  const LazyUserBooking = lazy(
    () => import("../../pages/userpage/user/UserBooking"),
  );
  const LazyUserWishList = lazy(
    () => import("../../pages/userpage/user/UserWishList"),
  );
  const LazyUserrRview = lazy(
    () => import("../../pages/userpage/user/UserrRview"),
  );
  const LazyUserCoupon = lazy(
    () => import("../../pages/userpage/user/UserCoupon"),
  );
  const LazyUserPoint = lazy(
    () => import("../../pages/userpage/user/UserPoint"),
  );
  const LazyUserPointPayment = lazy(
    () => import("../../components/point/PointPayment"),
  );
  const LazyPointComplete = lazy(
    () => import("../../components/point/PointComplete"),
  );
  const LazyUserTrip = lazy(() => import("../../pages/userpage/user/UserTrip"));
  const LazyFindPw = lazy(() => import("../../pages/userpage/user/FindPw"));
  const LazyChangePw = lazy(() => import("../../pages/userpage/user/ChangePw"));

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
      path: "notification",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyPushNotification />
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
      path: "point",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyUserPoint />
        </Suspense>
      ),
    },
    {
      path: "point/payment",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyUserPointPayment />
        </Suspense>
      ),
    },
    {
      path: "point/complete",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyPointComplete />
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
