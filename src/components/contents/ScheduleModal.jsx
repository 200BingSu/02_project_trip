import { Modal } from "antd";
import { useNavigate } from "react-router-dom";

const ScheduleModal = ({ handleRegistCancel }) => {
  //useNavigate
  const navigate = useNavigate();
  const navigateToSchedule = () => {
    navigate("/search/location");
  };
  return (
    <>
      <p className="text-[28px] text-slate-700">일정 추가는 일정 등록 후</p>
      <p className="text-[28px] text-slate-700">추가하실 수 있습니다.</p>
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
    </>
  );
};

export default ScheduleModal;
