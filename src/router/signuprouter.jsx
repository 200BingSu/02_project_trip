import { lazy, Suspense } from "react";
import Loading from "../components/loading/Loading";

const signUpRouter = () => {
  const LazySignUp = lazy(() => import("../pages/signup/SignUpIndex"));
  const LazySignUpUser = lazy(() => import("../pages/signup/SignUpUser"));
  const LazySignUpBusiness = lazy(
    () => import("../pages/signup/SignUpBusiness"),
  );
  const LazyConfirmEmail = lazy(() => import("../pages/signup/ConfirmEmail"));
  const LazyConfirmBusinessNum = lazy(
    () => import("../pages/signup/ConfirmBusinessNum"),
  );
  const LazyCompleteSignUp = lazy(
    () => import("../pages/signup/CompleteSingUP"),
  );
  const LazyKakaoSingup = lazy(() => import("../pages/signup/Kakao"));

  return [
    {
      path: "index",
      element: (
        <Suspense fallback={<Loading />}>
          <LazySignUp />
        </Suspense>
      ),
    },
    {
      path: "user",
      element: (
        <Suspense fallback={<Loading />}>
          <LazySignUpUser />
        </Suspense>
      ),
    },
    {
      path: "business",
      element: (
        <Suspense fallback={<Loading />}>
          <LazySignUpBusiness />
        </Suspense>
      ),
    },
    {
      path: "confirmemail",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyConfirmEmail />
        </Suspense>
      ),
    },
    {
      path: "confirmbusinessnumber",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyConfirmBusinessNum />
        </Suspense>
      ),
    },
    {
      path: "complete",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyCompleteSignUp />
        </Suspense>
      ),
    },
    {
      path: "kakao", //signup/kakao
      element: (
        <Suspense fallback={<Loading />}>
          <LazyCompleteSignUp />
        </Suspense>
      ),
    },
  ];
};
export default signUpRouter;
