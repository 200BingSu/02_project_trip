import { lazy, Suspense } from "react";
import Loading from "../components/loading/Loading";

const usertrouter = () => {
  // const LazyUserIndex = lazy(() => import("../pages/user/UserIndex"));
  const LazyUserEdit = lazy(() => import("../pages/user/UserEdit"));
  const LazyUserTrips = lazy(() => import("../pages/user/UserTrips"));
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
  ];
};

export default usertrouter;
