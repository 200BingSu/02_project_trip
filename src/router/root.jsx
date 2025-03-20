import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

// import companyRouter from "./companyrouter";
import Layout from "../components/layout/Layout";
import Loading from "../components/loading/Loading";
import NotFound from "../pages/NotFound";
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
import BusinessLayout from "../components/layout/BusinessLayout";
import ChatRoom from "../pages/common/ChatRoom";
import announcementRouter from "./common/announcementrouter";
import pointRouter from "./business/pointRouter";
import reportRouter from "./common/reportrouter";
import myPageRouter from "./business/mypagerouter";
// 사용자 lazys
const LazyHome = lazy(() => import("../pages/Index"));
const LazyBooking = lazy(() => import("../pages/userpage/bookings/Booking"));
const LazyBudget = lazy(() => import("../pages/userpage/budget/BudgetIndex"));
const LazyCoupon = lazy(() => import("../pages/userpage/coupon/CouponIndex"));
const LazyNotification = lazy(
  () => import("../pages/userpage/notification/NotificationIndex"),
);
const LazyPayment = lazy(
  () => import("../pages/userpage/payment/PaymentIndex"),
);
const LazySchedule = lazy(() => import("../pages/userpage/schedule/Schedule"));
const LazyScheduleBoard = lazy(
  () => import("../pages/userpage/scheduleboard/ScheduleBoard"),
);
const LazySearch = lazy(() => import("../pages/userpage/search/SearchIndex"));
const LazySignIn = lazy(() => import("../pages/userpage/signin/SingInIndex"));
const LazySignUp = lazy(() => import("../pages/userpage/signup/SignUp"));
const LazyUser = lazy(() => import("../pages/userpage/user/User"));
const LazyPointProductPayment = lazy(
  () => import("../components/point/PointProductPayment"),
);
const LazyContent = lazy(() => import("../pages/userpage/contents/Contents"));
const LazyChat = lazy(() => import("../pages/common/ChatIndex"));

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
const LazyPoint = lazy(() => import("../pages/business/point/Point"));

// 공용
const LazyAnnouncement = lazy(
  () => import("../pages/common/announcement/Announcement"),
);
const LazyQnA = lazy(() => import("../pages/common/qna/QnA"));
const LazyReport = lazy(() => import("../pages/common/report/Report"));
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
        path: "/point/product/payment",
        element: (
          <Suspense fallback={<Loading />}>
            <LazyPointProductPayment />
          </Suspense>
        ),
        children: pointRouter(),
      },
    ],
  },
  // 사업자
  {
    path: "/business",
    element: <BusinessLayout />,
    children: [
      {
        index: true, // index route로 변경
        element: <LazyBusiness />,
      },
      {
        path: "booking", // '/' 제거됨
        element: (
          <Suspense fallback={<Loading />}>
            <LazyBusinessBooking />
          </Suspense>
        ),
        children: businessBookingRouter(),
      },
      {
        path: "coupon",
        element: (
          <Suspense fallback={<Loading />}>
            <LazyBusinessCoupon />
          </Suspense>
        ),
        children: businessCouponRouter(),
      },
      {
        path: "menu",
        element: <LazyBusinessMenu />,
        children: menuRouter(),
      },
      {
        path: "mypage",
        element: <LazyBusinessMypage />,
        children: myPageRouter(),
      },
      {
        path: "register",
        element: <LazyBusinessRegister />,
        children: registerRouter(),
      },
      {
        path: "review",
        element: <LazyBusinessReview />,
        children: reviewRouter(),
      },
      {
        path: "store",
        element: <LazyBusinessStore />,
        children: storeRouter(),
      },
      {
        path: "point",
        element: <LazyPoint />,
        children: pointRouter(),
      },
    ],
  },
  // 공용
  {
    path: "/chat",
    element: (
      <Suspense fallback={<Loading />}>
        <LazyChat />
      </Suspense>
    ),
  },
  {
    path: "/chatroom",
    element: <ChatRoom />,
  },
  {
    path: "/announcement",
    element: <LazyAnnouncement />,
    children: announcementRouter(),
  },
  {
    path: "/qna",
    element: <LazyQnA />,
  },
  {
    path: "/report",
    element: <LazyReport />,
    children: reportRouter(),
  },
  { path: "/test", element: <Test /> },
  { path: "*", element: <NotFound /> },
]);

export default router;
