import { Button, message } from "antd";
import { useCallback, useState } from "react";
import { BiSolidEditAlt } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import jwtAxios from "../../apis/jwt";
import { tripAtom } from "../../atoms/tripAtom";
import { ISchedule, ISelectPath } from "../../types/interface";
import AddSchedule from "./AddSchedule";
import { StrInfoProps } from "./StrInfo";

// API 응답 타입 정의
interface ApiRes {
  code: string;
}

interface ScheduleParams {
  trip: { lastSeq: number; day: number; nowTripId: number };
  selectPath: {
    totalTime?: number;
    totalDistance?: number;
    path_type?: string;
  };
  contentData: { strfId: number | string };
}

const StickyActionBar = ({ strfId, contentData }: StrInfoProps) => {
  const [, setModals] = useState({
    isRegistModalOpen: false,
    openPathModal: false,
    isReviewModalOpen: false,
  });
  const [selectPath] = useState<ISelectPath>({});
  const [trip] = useRecoilState(tripAtom);
  const [messageApi] = message.useMessage();
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  // 일정 등록
  const postSchedule = async (data: ScheduleParams): Promise<void> => {
    const sendData: ISchedule = {
      seq: data.trip.lastSeq + 1,
      day: data.trip.day || 1,
      time: data.selectPath.totalTime || null,
      distance: data.selectPath.totalDistance || null,
      strf_id: Number(data.contentData.strfId),
      trip_id: data.trip.nowTripId,
      path_type: data.selectPath.path_type || null,
    };
    console.log("sendData", sendData);
    try {
      const res = await jwtAxios.post<ApiRes>(`/api/schedule`, {
        ...sendData,
      });
      console.log("일정등록 결과", res.data);

      if (res.data.code === "200 성공") {
        success();
      }
    } catch (error) {
      console.log("일정등록 결과", error);
    }
  };

  // 성공 메시지 함수
  const success = useCallback(() => {
    messageApi.open({
      type: "success",
      content: "일정 추가가 완료되었습니다",
      style: { marginTop: "20vh" },
    });
  }, [messageApi]);

  // 일정 추가 클릭
  // const showRegistModal = () => {
  //   if (trip.nowTripId === 0) {
  //     setModals(prev => ({ ...prev, isRegistModalOpen: true }));
  //   } else if (trip.lastSeq > 0) {
  //     setModals(prev => ({ ...prev, openPathModal: true }));
  //   } else {
  //     // 변환된 strfId를 postSchedule에 전달
  //     postSchedule({
  //       trip,
  //       selectPath,
  //       contentData: {
  //         strfId: contentData?.strfId ?? 0, // undefined일 경우 기본값 0 사용
  //       },
  //     });
  //     navigate(`/schedule/index?tripId=${trip.nowTripId}`);
  //   }
  // };

  // 리뷰 등록 모달
  const showReviewModal = () => {
    setModals(prev => ({ ...prev, isReviewModalOpen: true }));
    navigate(`/contents/postreview?strfId=${strfId}`, { state: contentData });
  };

  return (
    <div className="sticky bottom-0 left-0 z-50 w-full px-4 py-5 flex gap-3 bg-white border-t-[1px] border-slate-100">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        icon={<FaLocationDot className="!text-sm opacity-50 mb-[2px]" />}
        className="flex items-center justify-center gap-[6px] border-slate-200 rounded-lg w-full h-auto py-[14px] text-lg text-slate-700 "
      >
        일정 추가
      </Button>
      <Button
        onClick={() => {
          showReviewModal();
        }}
        icon={<BiSolidEditAlt className="text-sm opacity-50 mb-[2px]" />}
        className="flex items-center justify-center gap-[6px]  border-slate-200 rounded-lg w-full  h-auto py-[14px] text-lg text-slate-700 "
      >
        리뷰쓰기
      </Button>

      {/* 일정 추가 모달창 */}

      {/* 일정 추가 모달창 */}
      {/* <Modal
        title="일정추가"
        open={modals.isRegistModalOpen}
        onOk={() => navigate("/search/location")}
        onCancel={() =>
          setModals(prev => ({ ...prev, isRegistModalOpen: false }))
        }
        closable={false}
        className="custom-modal-confirm"
        footer={[
          <Button
            onClick={() =>
              setModals(prev => ({ ...prev, isRegistModalOpen: false }))
            }
            className="text-slate-500"
          >
            취소
          </Button>,
          <Button
            onClick={() => navigate("/search/location")}
            className="text-primary"
          >
            일정 등록
          </Button>,
        ]}
      >
        <p className="text-sm text-slate-500 text-center mb-6">
          일정 추가는 일정 등록 후 추가하실 수 있습니다.
        </p>
      </Modal> */}
      {isOpen && <AddSchedule open={isOpen} onClose={() => setIsOpen(false)} />}
    </div>
  );
};

export default StickyActionBar;
