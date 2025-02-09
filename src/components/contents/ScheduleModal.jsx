import { useNavigate } from "react-router-dom";

const ScheduleModal = ({ handleRegistCancel }) => {
  //useNavigate
  const navigate = useNavigate();
  const navigateToSchedule = () => {
    navigate("/search/location");
  };
  return (
    <div
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white


          w-[468px]
          flex flex-col gap-[36px] pt-[40px] rounded-2xl
        "
    >
      <div className="custom-modal-header"></div>
      <div className="flex flex-col pt-[20px] w-full justify-center items-center pb-[20px]">
        <div className="flex flex-col w-full justify-center items-center">
          <p className="text-[28px] text-slate-700">일정 추가는 일정 등록 후</p>
          <p className="text-[28px] text-slate-700">추가하실 수 있습니다.</p>
        </div>
      </div>
      <div className="custom-modal-footer w-full flex py-[20px] justify-center">
        <button
          type="button"
          className="flex justify-center w-full text-slate-500 text-[24px] border-r border-slate-300"
          onClick={handleRegistCancel}
        >
          취소
        </button>
        <button
          type="button"
          className="flex justify-center w-full text-primary text-[24px]"
          onClick={navigateToSchedule}
        >
          일정 등록
        </button>
      </div>
    </div>
  );
};

export default ScheduleModal;
