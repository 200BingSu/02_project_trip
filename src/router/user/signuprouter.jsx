import { lazy, Suspense } from "react";
import Loading from "../../components/loading/Loading";

const signUpRouter = () => {
  const LazySignUp = lazy(() => import("../../pages/user/signup/SignUpIndex"));
  const LazySignUpUser = lazy(
    () => import("../../pages/user/signup/SignUpUser"),
  );
  const LazySignUpBusiness = lazy(
    () => import("../../pages/user/signup/SignUpBusiness"),
  );
  const LazyConfirmEmail = lazy(
    () => import("../../pages/user/signup/ConfirmEmail"),
  );
  const LazyAuthentication = lazy(
    () => import("../../pages/user/signup/Authentication"),
  );
  const LazyConfirmBusinessNum = lazy(
    () => import("../../pages/user/signup/ConfirmBusinessNum"),
  );
  const LazyCompleteSignUp = lazy(
    () => import("../../pages/user/signup/CompleteSingUP"),
  );
  const LazyKakaoSingup = lazy(() => import("../../pages/user/signup/Kakao"));

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
      path: "authentication",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyAuthentication />
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
          <LazyKakaoSingup />
        </Suspense>
      ),
    },
  ];
};
export default signUpRouter;
