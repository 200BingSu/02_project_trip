import React, { useEffect, useState, useRef } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import ReactDatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import { addMonths, format, isBefore, startOfDay } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "../../../styles/custom-datepicker.css";
import TitleHeader from "../../../components/layout/header/TitleHeader";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { RiArrowGoBackFill } from "react-icons/ri";
import axios from "axios";
import dayjs from "dayjs";
import { TRIP } from "../../../constants/api";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../../../atoms/userAtom";
import { tripAtom } from "../../../atoms/tripAtom";
import { getCookie } from "../../../utils/cookie";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import jwtAxios from "../../../apis/jwt";

// 한글 로케일 등록
registerLocale("ko", ko);

const SelectDays = () => {
  const accessToken = getCookie("accessToken");
  //recoil

  const [tripId, setTripId] = useRecoilState(tripAtom);
  useEffect(() => {
    // console.log(tripId);
  }, [tripId]);
  //useNavigate
  const navigate = useNavigate();
  const location = useLocation();
  const locationData = location.state;
  console.log("locationData", locationData);
  const locationIdArr = locationData.selectedLocationId?.map((item, index) => {
    return item.locationId;
  });
  console.log(locationIdArr);
  const tripTitle = locationData?.title;
  // console.log(tripTitle);
  const navigateBack = () => {
    navigate(-1);
  };
  const navigateScheduleIndex = tripId => {
    navigate(`/schedule/index?tripId=${tripId}`);
  };
  // useState
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const datePickerRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  //api 여행 추가
  const postTrip = async () => {
    const startAt = dayjs(startDate).format("YYYY-MM-DD");
    const endAt = dayjs(endDate).format("YYYY-MM-DD");
    const sendData = {
      location_id: locationIdArr,
      title: tripTitle,
      start_at: startAt,
      end_at: endAt,
    };
    console.log("sendData", sendData);
    try {
      const res = await jwtAxios.post(`${TRIP.postTrip}`, sendData);
      console.log("여행 생성", res.data);
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        const newTripId = resultData.data.trip_id;
        console.log("newTripId", newTripId);
        setTripId(newTripId);
        // console.log(tripId);
        navigateScheduleIndex(newTripId);
      }
    } catch (error) {
      console.log("여행 생성 실패", error);
    }
  };
  // api 여행 스크랩
  const postTripScrap = async () => {
    const startAt = dayjs(startDate).format("YYYY-MM-DD");
    const endAt = dayjs(endDate).format("YYYY-MM-DD");
    const sendData = {
      tripReviewId: locationData.tripReviewId,
      // copyTripId: locationData.selectedLocationId,
      copyTripId: locationData.tripId,
      newStartAt: startAt,
      newEndAt: endAt,
    };
    try {
      const res = await jwtAxios.post(`/api/trip-review/scrap`, sendData);
    } catch (error) {
      console.log("여행 스크랩", error);
    }
  };
  //일정 생성 버튼
  const hanldeClickPostTrip = () => {
    if (locationData.from === "/scheduleboard/scheduleDetail") {
      postTripScrap();
    } else {
      postTrip();
    }
  };
  // 달력
  const onChange = dates => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  const resetDates = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const today = startOfDay(new Date());
  // 날짜 셀 커스터마이즈
  const renderDayContents = (day, date) => {
    const dayOfWeek = date.getDay();
    const isPastDate = isBefore(date, today); // 오늘 이전 날짜 여부

    return (
      <span
        className={`custom-day ${
          isPastDate
            ? "custom-day-past" // 오늘 이전 날짜는 회색
            : dayOfWeek === 6 || dayOfWeek === 0
              ? "custom-day-weekend" // 토요일, 일요일은 빨간색
              : ""
        }`}
      >
        {day}
      </span>
    );
  };
  useEffect(() => {
    // console.log("시작일", startDate);
    // console.log("종료일", endDate);
  }, [endDate]);

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
    datePickerRef.current.setFocus();
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
    datePickerRef.current.setFocus();
  };
  // 날짜 계산
  const duration = dayjs(endDate).diff(dayjs(startDate), "day");
  return (
    <div>
      <TitleHeader icon="back" onClick={navigateBack} title="일정 선택" />
      {/* 달력 */}
      <div className="mt-[72px] flex flex-col gap-[12px] mb-[50px]">
        {/* 요일 */}
        <ul className="flex items-center justify-between px-[32px] py-[10px]">
          <li className="text-[12px] flex items-center justify-center w-[92px] h-[14px] text-secondary3">
            일
          </li>
          <li className="text-[12px] flex items-center justify-center w-[92px] h-[14px] text-slate-700">
            월
          </li>
          <li className="text-[12px] flex items-center justify-center w-[92px] h-[14px] text-slate-700">
            화
          </li>
          <li className="text-[12px] flex items-center justify-center w-[92px] h-[14px] text-slate-700">
            수
          </li>
          <li className="text-[12px] flex items-center justify-center w-[92px] h-[14px] text-slate-700">
            목
          </li>
          <li className="text-[12px] flex items-center justify-center w-[92px] h-[14px] text-slate-700">
            금
          </li>
          <li className="text-[12px] flex items-center justify-center w-[92px] h-[14px] text-secondary3">
            토
          </li>
        </ul>
        {/* 라인 */}
        <div className="h-[10px] bg-slate-100"></div>
        {/* 달력 */}
        <div className="flex flex-col gap-[12px] px-[32px]">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevMonth}
              className="px-2 py-2 text-slate-600 text-[20px] rounded hover:bg-gray-100"
            >
              <IoIosArrowBack />
            </button>

            <button
              onClick={handleNextMonth}
              className="px-2 py-2 text-slate-600 text-[20px] rounded hover:bg-gray-100"
            >
              <IoIosArrowForward />
            </button>
          </div>

          <DatePicker
            ref={datePickerRef}
            selected={startDate}
            selectsRange={true}
            onChange={onChange}
            minDate={new Date()}
            maxDate={addMonths(new Date(), 5)}
            startDate={startDate}
            endDate={endDate}
            inline
            showDisabledMonthNavigation
            monthsShown={2}
            locale="ko"
            form="external-form"
            openToDate={currentDate}
            renderCustomHeader={({ monthDate }) => (
              <div>
                <span className="react-datepicker__current-month">
                  {monthDate.toLocaleString("ko", {
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
            renderDayContents={renderDayContents}
            className="custom-datepicker"
          />
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="flex gap-[5px] text-slate-700 items-center"
              onClick={resetDates}
            >
              <RiArrowGoBackFill className="text-[12px]" />
              <span className="text-[16px] underline whitespace-nowrap">
                초기화
              </span>
            </button>
            <div className="flex gap-[5px] justify-center items-center">
              <p className="text-[16px] font-semibold text-slate-600">
                {startDate && endDate
                  ? `${dayjs(startDate).format("YYYY-MM-DD")} ~ ${dayjs(endDate).format("YYYY-MM-DD")}`
                  : "날짜를 선택해주세요"}
              </p>
              <p className="text-[16px] text-slate-500">
                {startDate && endDate && `(${duration}박 ${duration + 1}일)`}
              </p>
            </div>
            <Button
              type="primary"
              className="h-[54px] px-[20px] py-[15px] rounded-lg text-[20px] font-semibold"
              onClick={hanldeClickPostTrip}
            >
              일정 등록
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectDays;
