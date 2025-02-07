import { lazy, Suspense } from "react";
import Loading from "../components/loading/Loading";

const usertrouter = () => {
  // const LazyUserIndex = lazy(() => import("../pages/user/UserIndex"));
  const LazyUserEdit = lazy(() => import("../pages/user/UserEdit"));
  const LazyUserTrips = lazy(() => import("../pages/user/UserTrips"));

  const LazyUserRecentList = lazy(() => import("../pages/user/UserRecentList"));

  const LazyUserBooking = lazy(() => import("../pages/user/UserBooking"));
  const LazyUserWishList = lazy(() => import("../pages/user/UserWishList"));

  return [
    // {
    //   path: "mypage",
    //   element: (
    //     <Suspense fallback={<Loading />}>
    //       <LazyUserIndex />
    //     </Suspense>
    //   ),
    // },
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
  ];
};

export default usertrouter;
