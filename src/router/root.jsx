import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

// import companyRouter from "./companyrouter";
import Layout from "../components/layout/Layout";
import Loading from "../components/loading/Loading";
import NotFound from "../pages/NotFound";
import KaKao2 from "../pages/signup/KaKao2";
import Test from "../pages/Test";
import bookingRouter from "./user/bookingrouter";
import contentsRouter from "./user/contentsrouter";
import scheduleBoardRouter from "./user/scheduleboardrouter";
import scheduleRouter from "./user/schedulerouter";
import searchRouter from "./user/searchrouter";
import signUpRouter from "./user/signuprouter";
import usertrouter from "./user/usertrouter";
// 사업자
import registerRouter from "./business/registerrouter";
import businessCouponRouter from "./business/couponrouter";
import businessBookingRouter from "./business/bookingrouter";
import menuRouter from "./business/menurouter";
import reviewRouter from "./business/reviewrouter";
import storeRouter from "./business/storerouter";
// 사용자 lazys
const LazyHome = lazy(() => import("../pages/Index"));
const LazyBooking = lazy(() => import("../pages/bookings/Booking"));
const LazyBudget = lazy(() => import("../pages/budget/BudgetIndex"));
const LazyCoupon = lazy(() => import("../pages/coupon/CouponIndex"));
const LazyNotification = lazy(
  () => import("../pages/notification/NotificationIndex"),
);
const LazyPayment = lazy(() => import("../pages/payment/PaymentIndex"));
const LazySchedule = lazy(() => import("../pages/schedule/Schedule"));
const LazyScheduleBoard = lazy(
  () => import("../pages/scheduleboard/ScheduleBoard"),

);
const LazySearch = lazy(() => import("../pages/search/SearchIndex"));
const LazySignIn = lazy(() => import("../pages/signin/SingInIndex"));
const LazySignUp = lazy(() => import("../pages/signup/SignUp"));
const LazyUser = lazy(() => import("../pages/user/User"));
const LazyContent = lazy(() => import("../pages/contents/Contents"));
const LazyChat = lazy(() => import("../pages/chat/ChatIndex"));

// 사업자
const LazyBusiness = lazy(() => import("../pages/business/BusinessIndex"));
const LazyBusinessMypage = lazy(
  () => import("../pages/business/mypage/Mypage"),
);
const LazyBusinessRegister = lazy(
  () => import("../pages/business/register/Register"),
);
const LazyBusinessStore = lazy(() => import("../pages/business/store/Store"));
const LazyBusinessReview = lazy(
  () => import("../pages/business/review/Review"),
);
const LazyBusinessMenu = lazy(() => import("../pages/business/menu/Menu"));
const LazyBusinessCoupon = lazy(
  () => import("../pages/business/coupon/Coupon"),
);
const LazyBusinessBooking = lazy(
  () => import("../pages/business/booking/Booking"),
);

const router = createBrowserRouter([
  // 사용자
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

      { path: "/test", element: <Test /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  // 사업자
  {
    path: "/business",
    element: <BusinessLayout />,
    children: [
      { path: "/", element: <LazyBusiness /> },
      {
        path: "/booking",
        element: <LazyBusinessBooking />,
        children: businessBookingRouter(),
      },
      {
        path: "/coupon",
        element: <LazyBusinessCoupon />,
        children: businessCouponRouter(),
      },
      {
        path: "/menu",
        element: <LazyBusinessMenu />,
        children: menuRouter(),
      },
      { path: "/mypage", element: <LazyBusinessMypage /> },
      {
        path: "/register",
        element: <LazyBusinessRegister />,
        children: registerRouter(),
      },
      {
        path: "/review",
        element: <LazyBusinessReview />,
        children: reviewRouter(),
      },
      {
        path: "/store",
        element: <LazyBusinessStore />,
        children: storeRouter(),
      },
    ],
  },
]);

export default router;
