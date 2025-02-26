import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

// import companyRouter from "./companyrouter";
import Layout from "../components/layout/Layout";
import Loading from "../components/loading/Loading";
import NotFound from "../pages/NotFound";
import KaKao2 from "../pages/signup/KaKao2";
import Test from "../pages/Test";
import bookingRouter from "./bookingrouter";
import contentsRouter from "./contentsrouter";
import scheduleBoardRouter from "./scheduleboardrouter";
import scheduleRouter from "./schedulerouter";
import searchRouter from "./searchrouter";
import signUpRouter from "./signuprouter";
import usertrouter from "./usertrouter";

// lazys

const LazyHome = lazy(() => import("../pages/Index"));
const LazyBooking = lazy(() => import("../pages/bookings/Booking"));
const LazyBudget = lazy(() => import("../pages/budget/BudgetIndex"));
const LazyBusiness = lazy(() => import("../pages/business/BusinessIndex"));
const LazyCoupon = lazy(() => import("../pages/coupon/CouponIndex"));
const LazyNotification = lazy(
  () => import("../pages/notification/NotificationIndex"),
);
const LazyPayment = lazy(() => import("../pages/payment/PaymentIndex"));
const LazySchedule = lazy(() => import("../pages/schedule/Schedule"));
const LazyScheduleBoard = lazy(
  () => import("../pages/scheduleboard/scheduleBoard"),
);
const LazySearch = lazy(() => import("../pages/search/SearchIndex"));
const LazySignIn = lazy(() => import("../pages/signin/SingInIndex"));
const LazySignUp = lazy(() => import("../pages/signup/SignUp"));
const LazyUser = lazy(() => import("../pages/user/User"));
const LazyContent = lazy(() => import("../pages/contents/Contents"));
const LazyChat = lazy(() => import("../pages/chat/ChatIndex"));

// AuthWrapper 컴포넌트 생성
// const accessToken = getCookie("accessToken");
// const AuthWrapper = () => {
//   const { userId, accessToken } = useRecoilValue(userAtom);
//   return accessToken ? <LazyHome /> : <Navigate to="/signin" replace />;
// };
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<Loading />}>
            {/* {accessToken ? <LazyHome /> : <Navigate to="/signin" replace />} */}
            {/* <AuthWrapper /> */}
            <LazyHome />
          </Suspense>
        ),
      },
      {
        path: "/contents",
        element: (
          <Suspense fallback={<Loading />}>
            <LazyContent />
          </Suspense>
        ),
        children: contentsRouter(),
      },
      {
        path: "/booking",
        element: (
          <Suspense fallback={<Loading />}>
            <LazyBooking />
          </Suspense>
        ),
        children: bookingRouter(),
      },

      {
        path: "/budget",
        element: (
          <Suspense fallback={<Loading />}>
            <LazyBudget />
          </Suspense>
        ),
      },
      {
        path: "/business",
        element: (
          <Suspense fallback={<Loading />}>
            <LazyBudget />
          </Suspense>
        ),
      },
      {
        path: "/coupon",
        element: (
          <Suspense fallback={<Loading />}>
            <LazyCoupon />
          </Suspense>
        ),
      },
      {
        path: "/notification",
        element: (
          <Suspense fallback={<Loading />}>
            <LazyNotification />
          </Suspense>
        ),
      },
      {
        path: "/payment",
        element: (
          <Suspense fallback={<Loading />}>
            <LazyPayment />
          </Suspense>
        ),
      },
      {
        path: "/schedule",
        element: (
          <Suspense fallback={<Loading />}>
            <LazySchedule />
          </Suspense>
        ),
        children: scheduleRouter(),
      },
      {
        path: "/scheduleboard",
        element: (
          <Suspense fallback={<Loading />}>
            <LazyScheduleBoard />
          </Suspense>
        ),
        children: scheduleBoardRouter(),
      },
      {
        path: "/search",
        element: (
          <Suspense fallback={<Loading />}>
            <LazySearch />
          </Suspense>
        ),
        children: searchRouter(),
      },
      {
        path: "/signin",
        element: (
          <Suspense fallback={<Loading />}>
            <LazySignIn />
          </Suspense>
        ),
      },
      {
        path: "/signup",
        element: (
          <Suspense fallback={<Loading />}>
            <LazySignUp />
          </Suspense>
        ),
        children: signUpRouter(),
      },
      {
        path: "/user",
        element: (
          <Suspense fallback={<Loading />}>
            <LazyUser />
          </Suspense>
        ),
        children: usertrouter(),
      },
      {
        path: "/chat",
        element: (
          <Suspense fallback={<Loading />}>
            <LazyChat />
          </Suspense>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
