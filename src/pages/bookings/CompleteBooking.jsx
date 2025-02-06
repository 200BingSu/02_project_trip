import { useNavigate } from "react-router-dom";
import TitleHeader from "../../components/layout/header/TitleHeader";

const CompleteBooking = () => {
  //useNavigate
  const navigate = useNavigate();
  const navigateHome = () => {
    navigate("/");
  };
  return (
    <div>
      <TitleHeader icon="close" title="결제완료" onClick={navigateHome} />
      <div className="mt-[91px] px-[32px] flex flex-col gap-[31px] items-center mb-[30px]">
        {/* 이미지 */}
        <div>
          <img src="/public/images/booking/complete.svg" alt="" />
        </div>
        {/* text */}
        <div className="flex flex-col items-center">
          <p className="text-[36px] text-slate-700 font-semibold">
            <span className="text-primary">닉네임</span>님
          </p>
          <p className="text-[36px] font-semibold text-slate-700">
            결제가 완료되었습니다.
          </p>
        </div>
        {/* 예약 정보 */}
        <ul
          className="w-full px-[32px] py-[30px] rounded-2xl
                        flex flex-col gap-[20px]
                        bg-slate-50"
        >
          <li className="flex items-center justify-start">
            <p className="w-1/2 text-[18px] text-slate-700 font-semibold">
              객실명
            </p>
            <p className="text-[18px] text-slate-700">스탠다드 킹사이즈 배드</p>
          </li>
          <li className="flex items-center justify-start">
            <p className="w-1/2 text-[18px] text-slate-700 font-semibold">
              입실일
            </p>
            <p className="text-[18px] text-primary">2025년 02월 01일 (토)</p>
          </li>
          <li className="flex items-center justify-start">
            <p className="w-1/2 text-[18px] text-slate-700 font-semibold">
              퇴실일
            </p>
            <p className="text-[18px] text-slate-700">2025년 02월 04일 (화)</p>
          </li>
          <li className="flex items-center justify-start">
            <p className="w-1/2 text-[18px] text-slate-700 font-semibold">
              인원
            </p>
            <p className="text-[18px] text-slate-700">성인 2명</p>
          </li>
        </ul>
        {/* 체크인, 체크아웃 */}
        <ul className="flex w-full">
          <li
            className="border border-slate-100 py-[30px]
                        flex flex-col gap-[10px] w-full items-center justify-center"
          >
            <p className="text-[24px] text-slate-400 font-bold">체크인</p>
            <p className="text-[24px] text-slate-700">날짜, 요일, 시간</p>
          </li>
          <li
            className="border border-slate-100 py-[30px]
                        flex flex-col gap-[10px] w-full items-center justify-center"
          >
            <p className="text-[24px] text-slate-400 font-bold">체크인</p>
            <p className="text-[24px] text-slate-700">날짜, 요일, 시간</p>
          </li>
        </ul>
        {/* 버튼 */}
        <div className="flex gap-[10px] w-full">
          <button
            type="button"
            className="px-[15px] py-[30px] rounded-lg border border-slate-300
            text-[24px] font-semibold text-slate-700 w-full"
          >
            예약 확인하기
          </button>
          <button
            type="button"
            onClick={() => {
              navigate("/");
            }}
            className="px-[15px] py-[30px] rounded-lg border border-slate-300
            text-[24px] font-semibold text-slate-700 w-full"
          >
            메인으로 가기
          </button>
        </div>
      </div>
    </div>
  );
};
export default CompleteBooking;
