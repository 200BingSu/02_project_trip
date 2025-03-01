// bookingRouter 수정
import { lazy, Suspense } from "react";
import Loading from "../../components/loading/Loading";

const LazyRegisterIndex = lazy(
  () => import("../../pages/business/register/RegisterIndex"),
);
const LazyConfirmRegister = lazy(
  () => import("../../pages/business/register/ConfirmRegister"),
);

const registerRouter = () => {
  return [
    {
      path: "",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyRegisterIndex />
        </Suspense>
      ),
    },
    {
      path: "confirm",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyConfirmRegister />
        </Suspense>
      ),
    },
  ];
};
export default registerRouter;
