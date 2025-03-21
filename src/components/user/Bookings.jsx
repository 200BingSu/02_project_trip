import { Button, Drawer, message } from "antd";
import dayjs from "dayjs";

import { memo, useCallback, useEffect, useState } from "react";

import { IoIosArrowRoundForward } from "react-icons/io";
import { ProductPic } from "../../constants/pic";
import { CgMoreVerticalAlt } from "react-icons/cg";
import BottomSheet from "../basic/BottomSheet";
import { GoCommentDiscussion } from "react-icons/go";
import { BiSolidEditAlt, BiTrash } from "react-icons/bi";
import "dayjs/locale/ko";
import { getCookie } from "../../utils/cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwtAxios from "../../apis/jwt";
import { PiWarningCircleBold } from "react-icons/pi";
import Provision from "../booking/Provision";
import customParseFormat from "dayjs/plugin/customParseFormat";

import NoData from "../common/NoData";

dayjs.extend(customParseFormat);
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
  console.log(data.bookingId);
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
    bookingId,
  } = data.data;
  // useNavigate
  const navigate = useNavigate();
  // 쿠키
  const accessToken = getCookie("accessToken");
  const actions = [
    {
      label: (
        <p className="flex items-center gap-3 px-4 py-[14px] text-lg text-slate-500">
          <GoCommentDiscussion className="text-slate-300" />
          문의하기
        </p>
      ),
      onClick: () => {
        createChatRoom();
      },
    },
    {
      label: (
        <p className="flex items-center gap-3 px-4 py-[14px] text-lg text-slate-500">
          <PiWarningCircleBold className="text-slate-300" />
          취소규정
        </p>
      ),
      onClick: () => {
        setPevOpen(true);
        setIsOpen(!isOpen);
      },
    },
  ];
  //useState
  const [isOpen, setIsOpen] = useState(false);
  const [prvOpen, setPevOpen] = useState(false);
  const [placement, setPlacement] = useState("bottom");

  const [bookingList, setBookingList] = useState([]);

  const onClose = () => {
    setPevOpen(false);
  };

  const getBookingList = useCallback(async () => {
    try {
      const res = await axios.get(`/api/booking?page=0`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("예약 목록", res.data);
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        setBookingList(resultData.data);
        // setBookingAtom({
        //   ...bookingAtom,
        //   data: [...bookingAtom.data, ...resultData.data],
        // });
      }
      // setBeforeList(resultData.data.beforeList);
      // setAfterList(resultData.data.afterList);
    } catch (error) {
      console.log("예약 목록 불러오기 실패", error);
    }
  }, []);

  useEffect(() => {
    getBookingList();
  }, []);

  // API 채팅방 생성
  const createChatRoom = async () => {
    const url = "/api/chat-room";
    const data = {
      strfId: strfId,
      title: strfTitle,
      bookingId: bookingId,
    };
    console.log("채팅방 생성 요청", data);
    try {
      const res = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("채팅방 생성", res.data);
      const resultData = res.data;
      if (resultData) {
        navigate(`/chatroom?roomId=${resultData.data}`);
      }
    } catch (error) {
      console.log("채팅방 생성", error);
      message.error("채팅방 생성에 실패했습니다.");
    }
  };

  // API 예약 환불
  const handleCancelBooking = async bookingId => {
    try {
      const res = await jwtAxios.patch("/api/booking", {
        bookingId: bookingId,
      });

      if (res.data.data === "50퍼센트 환불 완료") {
        message.success("50퍼센트 환불 완료");
        // 부모 컴포넌트의 예약 목록 새로고침
        data.getBookings?.();
      } else if (res.data.data === "70퍼센트 환불 완료") {
        message.success("70퍼센트 환불 완료");
        // 부모 컴포넌트의 예약 목록 새로고침
        data.getBookings?.();
      } else if (res.data.data === "100퍼센트 환불 완료") {
        message.success("100퍼센트 환불 완료");
        // 부모 컴포넌트의 예약 목록 새로고침
        data.getBookings?.();
      } else if (res.data.data === "환불 가능 기간이 아닙니다.") {
        message.error("환불 가능 기간이 아닙니다.");
      }
      getBookingList();
    } catch (error) {
      console.log("예약 취소 에러:", error);
    }
  };

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
            <Button
              onClick={() => navigate(`/contents/index?strfId=${strfId}`)}
              className="w-full h-auto py-3 rounded-lg text-base font-semibold text-slate-700"
            >
              상세보기
            </Button>
            <Button
              onClick={() => {
                handleCancelBooking(data.data.bookingId);
                getBookingList();
              }}
              className="w-full h-auto py-3 rounded-lg text-base font-semibold text-slate-700"
            >
              예약 취소
            </Button>
          </>
        );
      case 2:
        return (
          <>
            <Button
              onClick={() => navigate(`/contents/index?strfId=${strfId}`)}
              className="w-full h-auto py-3 rounded-lg text-base font-semibold text-slate-700"
            >
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
            <Button
              onClick={() => navigate(`/contents/index?strfId=${strfId}`)}
              className="w-full h-auto py-3 rounded-lg text-base font-semibold text-slate-700"
            >
              상세보기
            </Button>
          </>
        );
    }
  };

  return (
    <div className="w-full px-4 py-6 flex flex-col gap-4 border-b-[10px] border-slate-100 last:border-none">
      {/* 예약 상태 */}
      <div
        className={`w-fit flex items-center justify-center px-2 py-1 text-xs font-semibold ${matchStateStyle(state)}`}
      >
        <p>{matchState(state)}</p>
      </div>
      {/* 숙소 이름 */}
      <div>
        <h3 className="text-xl font-semibold text-slate-700">{strfTitle}</h3>
      </div>
      {/* 내용 */}
      <div className="flex gap-4">
        {/* 예약 정보 */}

        {/* 썸네일 */}
        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100">
          <img
            src={strfPic ? `${ProductPic}/${strfId}/${strfPic}` : ""}
            alt={strfTitle || ""}
            className="w-full h-full  aspect-square object-cover"
          />
        </div>
        {/* 정보 */}
        <div className="flex flex-col gap-3">
          {/* 날짜 */}
          <div className="flex items-start gap-2 text-sm text-slate-700">
            <h4 className="whitespace-nowrap text-slate-400 font-semibold text-sm ">
              이용일시
            </h4>
            <p className="text-base text-slate-700 tracking-tight break-all">
              <span>
                {dayjs(checkInDate, "YYYY-MM-DD").format("YYYY.MM.DD ddd")}
                &nbsp;~&nbsp;
                {dayjs(checkOutDate, "YYYY-MM-DD").format("YYYY.MM.DD ddd")}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3 text-base text-slate-700">
            <h4 className="whitespace-nowrap text-slate-400 font-semibold text-sm">
              예약일시
            </h4>
            <p className="text-base text-slate-700 tracking-tight">
              {dayjs(createdAt, "YYYY-MM-DD").format("YYYY.MM.DD ddd")}
            </p>
          </div>
          <div className="flex items-center gap-3 text-base text-slate-700">
            <h4 className="whitespace-nowrap text-slate-400 font-semibold text-sm tracking-tight">
              인원
            </h4>

            <p className="text-base text-slate-700 tracking-tight">1명</p>
          </div>
        </div>
      </div>
      {/* 버튼 */}
      <div className="flex gap-2 items-center">
        {matchButton(state)}
        <button
          type="button"
          className="aspect-square h-auto p-3 text-base text-slate-700 rounded-lg border border-slate-300 flex justify-center items-center"
          onClick={() => setIsOpen(true)}
        >
          <CgMoreVerticalAlt className="text-[1.5rem]" />
        </button>
      </div>
      <BottomSheet
        open={isOpen}
        onClose={() => setIsOpen(false)}
        actions={actions}
      />
      <Drawer
        title="예약 취소 규정"
        placement={placement}
        closable={false}
        onClose={onClose}
        open={prvOpen}
        key={placement}
      >
        <Provision />
      </Drawer>
    </div>
  );
};
export default memo(Bookings);
