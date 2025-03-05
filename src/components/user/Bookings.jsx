import { Button } from "antd";
import dayjs from "dayjs";
import { memo, useState } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { ProductPic } from "../../constants/pic";
import { CgMoreVerticalAlt } from "react-icons/cg";
import BottomSheet from "../basic/BottomSheet";
import { GoCommentDiscussion } from "react-icons/go";
import { BiSolidEditAlt, BiTrash } from "react-icons/bi";
import "dayjs/locale/ko";

dayjs.locale("ko");

const BookingState = ["결제완료", "예약확정", "이용완료", "취소완료"];
/**
 *
 *
 * ## 버튼
 * 1. 리뷰작성
 * 2. 문의하기
 * 3. 리뷰 만료
 */
const Bookings = data => {
  console.log(data.data);
  const {
    checkInDate,
    checkOutDate,
    strfTitle,
    strfPic,
    price,
    state,
    strfId,
    checkInTime,
    checkOutTime,
    createdAt,
  } = data.data;
  const actions = [
    {
      label: (
        <p className="flex items-center gap-3 px-4 py-[14px] text-lg text-slate-500">
          <GoCommentDiscussion className="text-slate-300" />
          문의하기
        </p>
      ),
    },
    {
      label: (
        <p className="flex items-center gap-3 px-4 py-[14px] text-lg text-slate-500">
          <BiSolidEditAlt className="text-slate-300" />
          수정하기
        </p>
      ),
    },
    {
      label: (
        <p className="flex items-center gap-3 px-4 py-[14px] text-lg text-slate-500">
          <BiTrash className="text-slate-300" />
          삭제하기
        </p>
      ),
    },
  ];
  //useState
  const [isOpen, setIsOpen] = useState(false);

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
  const matchState = state => {
    switch (state) {
      case 0:
        return "결제완료";
      case 1:
        return "예약확정";
      case 2:
        return "이용완료";
      case 3:
        return "취소완료";
    }
  };
  const matchStateStyle = state => {
    switch (state) {
      case 0:
        return "bg-[rgba(255,253,204,0.6)] text-[#FFCC00]";
      case 1:
        return "bg-[rgba(165,238,254,0.3)] text-primary";
      case 2:
        return "bg-slate-100 text-slate-400";
      case 3:
        return "bg-[rgba(253,180,161,0.3)] text-secondary3";
    }
  };
  const matchButton = state => {
    switch (state) {
      case 0:
      case 1:
        return (
          <>
            <Button className="w-full h-auto py-3 rounded-lg text-base font-semibold text-slate-700">
              상세보기
            </Button>
            <Button className="w-full h-auto py-3 rounded-lg text-base font-semibold text-slate-700">
              예약 취소
            </Button>
          </>
        );
      case 2:
        return (
          <>
            <Button className="w-full h-auto py-3 rounded-lg text-base font-semibold text-slate-700">
              상세보기
            </Button>
            <Button
              type="primary"
              className="w-full h-auto py-3 rounded-lg text-base font-semibold  text-white bg-primary"
            >
              리뷰작성
            </Button>
          </>
        );
      case 3:
        return (
          <>
            <Button className="w-full h-auto py-3 rounded-lg text-base font-semibold text-slate-700">
              상세보기
            </Button>
          </>
        );
    }
  };
  return (
    <div className="w-full px-6 py-4 flex flex-col gap-4 border-b-[10px] border-slate-100 last:border-none">
      {/* 예약 상태 */}
      <div
        className={`w-fit flex items-center justify-center px-2 py-1 text-sm font-bold ${matchStateStyle(state)}`}
      >
        <p>{matchState(state)}</p>
      </div>
      {/* 숙소 이름 */}
      <div>
        <h3 className="text-xl font-bold text-slate-700">{strfTitle}</h3>
      </div>
      {/* 내용 */}
      <div className="flex gap-[20px]">
        {/* 예약 정보 */}

        {/* 썸네일 */}
        {/* <div className="w-[85px] h-[85px] rounded-2xl overflow-hidden bg-slate-100">
          <img
            src={strfPic ? `${ProductPic}${strfId}/${strfPic}` : ""}
            alt={strfTitle || ""}
            className="w-full h-full object-cover"
          />
        </div> */}
        {/* 정보 */}
        <div className="flex flex-col gap-[10px]">
          {/* 날짜 */}
          <div className="flex items-center gap-3 text-[16px] text-slate-700">
            <h4 className="text-slate-400 font-semibold text-base tracking-tight">
              이용일시
            </h4>
            <p className="text-base text-slate-700">
              <span>{dayjs(checkInDate).format("YYYY.MM.DD ddd")}</span>
              <span>~</span>
              <span>{dayjs(checkOutDate).format("YYYY.MM.DD ddd")}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 text-[16px] text-slate-700">
            <h4 className="text-slate-400 font-semibold text-base">예약일시</h4>
            <p className="text-base text-slate-700 tracking-tight">
              {dayjs(createdAt).format("YYYY.MM.DD ddd")}
            </p>
          </div>
          <div className="flex items-center gap-3 text-[16px] text-slate-700">
            <h4 className="text-slate-400 font-semibold text-base tracking-tight">
              인원
            </h4>
            <p className="text-base text-slate-700">
              {dayjs(createdAt).format("YYYY.MM.DD ddd")}
            </p>
          </div>
        </div>
      </div>
      {/* 버튼 */}
      <div className="flex gap-[8px] items-center">
        {matchButton(state)}
        <button
          type="button"
          className="aspect-square h-auto py-3 px-3 text-2xl text-slate-700 rounded-lg border border-slate-300 flex justify-center items-center"
          onClick={() => setIsOpen(true)}
        >
          <CgMoreVerticalAlt />
        </button>
      </div>
      <BottomSheet
        open={isOpen}
        onClose={() => setIsOpen(false)}
        actions={actions}
      />
    </div>
  );
};
export default memo(Bookings);
