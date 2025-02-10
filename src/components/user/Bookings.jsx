import { Button } from "antd";
import dayjs from "dayjs";
import { memo } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";

/**
 * ## 예약 상태
 *  1. 대기중
 *  2. 예약 확정
 *  3. 예약 완료
 *  4. 취소완료
 *
 * ## 버튼
 * 1. 리뷰작성
 * 2. 문의하기
 * 3. 리뷰 만료
 */
const Bookings = ({ bookingStatus = 1 }) => {
  const today = dayjs().format("YYYY.MM.DD");
  //오늘 날짜 기준으로 버튼 상태 변경하기
  const categorizeDate = inputDate => {
    const today = dayjs().startOf("day");
    const targetDate = dayjs(inputDate).startOf("day");
    const sevenDaysLater = today.add(7, "day");

    return targetDate.isBefore(today)
      ? "문의하기"
      : targetDate.isBefore(sevenDaysLater)
        ? "리뷰작성"
        : "리뷰 만료";
  };

  return (
    <div
      className="w-full px-[30px] py-[30px]
    flex flex-col gap-[18px]"
    >
      {/* 날짜 */}
      <div className="flex justify-between items-start pb-[20px] border-b border-slate-200">
        <p className="font-medium text-[16px] text-slate-700">2025.01.01</p>
        <button
          type="button"
          className="flex items-center gap-[4px] 
          text-[14px] text-primary font-medium"
        >
          상세보기 <IoIosArrowRoundForward />
        </button>
      </div>
      {/* 예약 상태 */}
      <div
        className={`w-fit px-[10px] py-[5px] rounded-lg text-[12px] font-bold
          ${
            bookingStatus === 1
              ? "bg-white border border-primary text-primary"
              : bookingStatus === 2
                ? "bg-[rgba(165,238,254,0.6)] border border-primary3 text-primary3"
                : bookingStatus === 3
                  ? "bg-slate-100 border border-slate-300 text-slate-400"
                  : bookingStatus === 4
                    ? "bg-slate-100 border border-slate-300 text-slate-400"
                    : ""
          }`}
      >
        <p>예약 상태</p>
      </div>
      {/* 숙소 이름 */}
      <div>
        <h3 className="text-[20px] font-bold text-slate-700">숙소 이름</h3>
      </div>
      {/* 내용 */}
      <div className="flex gap-[20px]">
        {/* 예약 정보 */}

        {/* 썸네일 */}
        <div className="w-[85px] h-[85px] rounded-2xl overflow-hidden bg-slate-100">
          <img src="" alt="" className="w-full h-full object-cover" />
        </div>
        {/* 정보 */}
        <div className="flex flex-col gap-[10px]">
          {/* 날짜 */}
          <div className="flex items-center text-[16px] text-slate-700">
            <p>체크인 날짜</p>
            <p>~</p>
            <p>체크아웃 날짜</p>
          </div>
          {/* 숙박일, 체크인 시간 */}
          <div className="text-[14px] text-slate-500 flex items-center gap-[5px]">
            <p>숙박일</p>
            <p>|</p>
            <p>
              <span>체크인</span>
              <span>15:00</span>
              <span>체크아웃</span>
              <span>15:00</span>
            </p>
            <p>|</p>
            <p>
              <span>체크아웃</span>
              <span>15:00</span>
            </p>
          </div>
          {/* 금액 */}
          <div className="text-[14px] text-slate-500 flex items-center gap-[5px]">
            <p>결제 금액: </p>
            <p>{(100000).toLocaleString()}원</p>
          </div>
        </div>
      </div>
      {/* 버튼 */}
      <div>
        <Button
          type="primary"
          className="w-full h-[46px] rounded-lg text-[16px] font-bold"
        >
          예약 취소
        </Button>
      </div>
    </div>
  );
};
export default memo(Bookings);
