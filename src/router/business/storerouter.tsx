// bookingRouter 수정
import { lazy, Suspense } from "react";
import Loading from "../../components/loading/Loading";

const LazyStoreIndex = lazy(
  () => import("../../pages/business/store/StoreIndex"),
);
const LazyStoreEdit = lazy(
  () => import("../../pages/business/store/StroeEdit"),
);

const storeRouter = () => {
  return [
    {
      path: "/",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyStoreIndex />
        </Suspense>
      ),
    },
    {
      path: "edit",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyStoreEdit />
        </Suspense>
      ),
    },
  ];
};
export default storeRouter;
