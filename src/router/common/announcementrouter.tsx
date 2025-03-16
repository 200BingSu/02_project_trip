// bookingRouter 수정
import { lazy, Suspense } from "react";
import Loading from "../../components/loading/Loading";

const LazyAnnouncement = lazy(
  () => import("../../pages/common/announcement/Index"),
);
const LazyAnnouncementDetail = lazy(
  () => import("../../pages/common/announcement/Detail"),
);

const announcementRouter = () => {
  return [
    {
      index: true,
      element: (
        <Suspense fallback={<Loading />}>
          <LazyAnnouncement />
        </Suspense>
      ),
    },
    {
      path: "detail",
      element: (
        <Suspense fallback={<Loading />}>
          <LazyAnnouncementDetail />
        </Suspense>
      ),
    },
  ];
};
export default announcementRouter;
