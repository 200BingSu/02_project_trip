import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

// import companyRouter from "./companyrouter";
import Loading from "../components/loading/Loading";
import scheduleRouter from "./schedulerouter";
import NotFound from "../pages/NotFound";
import scheduleBoardRouter from "./scheduleboardrouter";
import signUpRouter from "./signuprouter";
import Layout from "../components/layout/Layout";
import searchRouter from "./searchrouter";

// lazy
const LazyHome = lazy(() => import("../pages/Index"));
const LazyBooking = lazy(() => import("../pages/bookings/BookingIndex"));
const LazyBudget = lazy(() => import("../pages/budget/BudgetIndex"));
const LazyBusiness = lazy(() => import("../pages/business/BusinessIndex"));
const LazyCoupon = lazy(() => import("../pages/coupon/CouponIndex"));
const LazyNotification = lazy(
  () => import("../pages/notification/NotificationIndex"),
);
const LazyPayment = lazy(() => import("../pages/payment/PaymentIndex"));
const LazySchedule = lazy(() => import("../pages/schedule/Schedule"));
const LazyScheduleBoard = lazy(
  () => import("../pages/scheduleBoard/ScheduleBoard"),
);
const LazySearch = lazy(() => import("../pages/search/SearchIndex"));
const LazySignIn = lazy(() => import("../pages/signin/SingInIndex"));
const LazySignUp = lazy(() => import("../pages/signup/SignUp"));
const LazyUser = lazy(() => import("../pages/user/UserIndex"));
const LazyContent = lazy(() => import("../pages/contents/ContentIndex"));

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<Loading />}>
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
      },
      {
        path: "/booking",
        element: (
          <Suspense fallback={<Loading />}>
            <LazyBooking />
          </Suspense>
        ),
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
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
