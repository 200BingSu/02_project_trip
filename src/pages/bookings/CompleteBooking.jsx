import { useNavigate, useSearchParams } from "react-router-dom";
import TitleHeader from "../../components/layout/header/TitleHeader";
import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");
const CompleteBooking = () => {
  //useNavigate
  const navigate = useNavigate();
  const navigateHome = () => {
    navigate("/");
  };
  // 쿼리스트링
  const [searchParams] = useSearchParams();
  const userName = searchParams.get("user_name");
  const checkIn = searchParams.get("check_in");
  console.log(checkIn);
  const checkOut = searchParams.get("check_out");
  const personnel = searchParams.get("personnel");
  const title = searchParams.get("title");
  return (
    <div>
      <TitleHeader icon="close" title="결제완료" onClick={navigateHome} />
      <div className="mt-[91px] px-[32px] flex flex-col gap-[31px] items-center mb-[30px]">
        {/* 이미지 */}
        <div>
          <img src="/images/booking/complete.svg" alt="" />
        </div>
        {/* text */}
        <div className="flex flex-col items-center">
          <p className="text-[36px] text-slate-700 font-semibold">
            <span className="text-primary">{userName}</span>님
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
            <p className="text-[18px] text-slate-700">{title}</p>
          </li>
          <li className="flex items-center justify-start">
            <p className="w-1/2 text-[18px] text-slate-700 font-semibold">
              입실일
            </p>
            <p className="text-[18px] text-primary">
              {dayjs(checkIn).format("YYYY-MM-DD (dd)")}
            </p>
          </li>
          <li className="flex items-center justify-start">
            <p className="w-1/2 text-[18px] text-slate-700 font-semibold">
              퇴실일
            </p>
            <p className="text-[18px] text-slate-700">
              {dayjs(checkOut).format("YYYY-MM-DD (dd)")}
            </p>
          </li>
          <li className="flex items-center justify-start">
            <p className="w-1/2 text-[18px] text-slate-700 font-semibold">
              인원
            </p>
            <p className="text-[18px] text-slate-700">인원 {personnel}명</p>
          </li>
        </ul>
        {/* 체크인, 체크아웃 */}
        <ul className="flex w-full">
          <li
            className="border border-slate-100 py-[30px]
                        flex flex-col gap-[10px] w-full items-center justify-center"
          >
            <p className="text-[24px] text-slate-400 font-bold">체크인</p>
            <p className="text-[24px] text-slate-700">{checkIn}</p>
          </li>
          <li
            className="border border-slate-100 py-[30px]
                        flex flex-col gap-[10px] w-full items-center justify-center"
          >
            <p className="text-[24px] text-slate-400 font-bold">체크인</p>
            <p className="text-[24px] text-slate-700">{checkOut}</p>
          </li>
        </ul>
        {/* 버튼 */}
        <div className="flex gap-[10px] w-full">
          <button
            type="button"
            className="px-[15px] py-[30px] rounded-lg border border-slate-300
            text-[24px] font-semibold text-slate-700 w-full"
            onClick
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
