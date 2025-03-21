
import { Button } from "antd";

import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useState } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ProductPic } from "../../../constants/pic";
import { IBooking } from "../../../types/interface";
import CenterModalTs from "../../common/CenterModalTs";

dayjs.extend(customParseFormat);

interface BookingListProps {
  item: IBooking;
}

const BookingList = ({ item }: BookingListProps) => {
  console.log("item", item);
  // 쿼리
  const [searchParams] = useSearchParams();
  const strfId = searchParams.get("strfId");

  // navigate
  const navigate = useNavigate();
  const navigateToBookingDetail = () => {
    navigate(
      `/business/booking/detail?strfId=${strfId}&bookingId=${item.bookingId}&state=${item.state}`,
    );
  };
  // useState
  const [isOkModalOpen, setIsOkModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const matchState = (state: string) => {
    switch (state) {
      case "0":
        return "결제완료";
      case "1":
        return "예약확정";
      case "2":
        return "이용완료";
      case "3":
        return "취소완료";
    }
  };
  const matchStateStyle = (state: string) => {
    switch (state) {
      case "0":
        return "bg-[rgba(255,253,204,0.6)] text-[#FFCC00]";
      case "1":
        return "bg-[rgba(165,238,254,0.3)] text-primary";
      case "2":
        return "bg-slate-100 text-slate-400";
      case "3":
        return "bg-[rgba(253,180,161,0.3)] text-secondary3";
    }
  };

  const duration = (start: Dayjs, end: Dayjs) => {
    const duration = end.diff(start, "day");
    return duration;
  };

  // const matchBusiBookingButton = (state: string) => {
  //   switch (state) {
  //     case "0":
  //     case "1":
  //       return (
  //         <>
  //           {/* <Button
  //             color="primary"
  //             variant="filled"
  //             className="w-full h-auto py-3 rounded-lg text-base font-semibold text-primary3 "
  //             onClick={() => setIsCancelModalOpen(true)}
  //           >
  //             예약 취소
  //           </Button> */}
  //           <Button
  //             type="primary"
  //             className="w-full h-auto py-3 rounded-lg text-base font-semibold "
  //             onClick={() => setIsOkModalOpen(true)}
  //           >
  //             예약 승인
  //           </Button>
  //         </>
  //       );
  //     case "2":
  //       return (
  //         <>
  //           {/* <Button
  //             className="w-full h-auto py-3 rounded-lg text-base font-semibold bg-primary2 text-slate-700"
  //             onClick={() => setIsCancelModalOpen(true)}
  //           >
  //             예약 취소
  //           </Button> */}
  //         </>
  //       );
  //     case "3":
  //       return (
  //         <>
  //           {/* <Button
  //             className="w-full h-auto py-3 rounded-lg text-base font-semibold text-slate-700"
  //             disabled
  //           >
  //             예약 취소 완료
  //           </Button> */}
  //         </>
  //       );
  //   }
  // };


  return (
    <div className="flex flex-col gap-3">
      <div className="px-4 py-3 flex flex-col gap-2">
        {/* 날짜 */}
        <div className="flex items-start justify-between h-[10vw] max-h-[60px] border-b border-slate-200 ">

          <p></p>

          <button
            type="button"
            className="flex gap-1 items-center text-primary"
            onClick={navigateToBookingDetail}
          >
            <p>상세보기</p>
            <i>
              <IoIosArrowRoundForward />
            </i>
          </button>
        </div>
        {/* 예약 내용 */}
        <section className="flex flex-col gap-5">
          {/* 예약 정보 */}
          <div className="flex flex-col gap-3">
            {/* 상태 */}
            <div
              className={`w-fit flex items-center justify-center px-2 py-1 text-sm font-bold ${matchStateStyle(item.state)}`}
            >
              <p>{matchState(item.state)}</p>
            </div>
            {/*  제목 */}
            <div>
              <h2 className="text-xl font-bold text-slate-700">{item.title}</h2>
            </div>
            {/* 내용 */}
            <div className="flex items-start gap-5">
              <div className="w-20 aspect-square rounded-2xl bg-slate-200 overflow-hidden">
                <img
                  src={`${ProductPic}/${strfId}/${item.picName}`}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-base text-slate-700">{`${item.checkInDate} ~ ${item.checkOutDate}`}</p>
                <p className="text-slate-500 text-sm">
                  {duration(
                    dayjs(item.checkInDate, "YYYY-MM-DD dd"),
                    dayjs(item.checkOutDate, "YYYY-MM-DD dd"),
                  )}
                  박{" "}
                  {duration(
                    dayjs(item.checkInDate, "YYYY-MM-DD dd"),
                    dayjs(item.checkOutDate, "YYYY-MM-DD dd"),
                  ) + 1}
                  일, 체크인 {item.checkInTime}, 체크아웃 {item.checkOutTime}
                </p>
                <p className="text-slate-500 text-sm">
                  {item.totalPayment.toLocaleString()}원
                </p>
              </div>
            </div>
          </div>

          {/* <div className="flex items-center gap-3 w-full"> */}
          {/* {matchBusiBookingButton(item.state)} */}
          {/* <Button className="w-full h-[16vw] max-h-[50px]">예약 취소</Button>
            <Button type="primary" className="w-full h-[16vw] max-h-[50px]">
              예약 승인
            </Button> */}
          {/* </div> */}

        </section>
      </div>
      {/* 모달 */}
      {isOkModalOpen && (
        <CenterModalTs
          title="예약 승인"
          content="해당 예약을 승인하시겠습니까?"
          handleClickSubmit={() => {}}
          handleClickCancle={() => setIsOkModalOpen(false)}
        />
      )}
      {isCancelModalOpen && (
        <CenterModalTs
          title="예약 취소"
          content="해당 예약을 취소하시겠습니까?"
          handleClickSubmit={() => {
            console.log("예약 취소");
          }}
          handleClickCancle={() => setIsCancelModalOpen(false)}
        />
      )}
    </div>
  );
};

export default BookingList;
