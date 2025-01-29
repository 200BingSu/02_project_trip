import React, { memo, useEffect, useRef, useState } from "react";
import { DatePicker, Skeleton, Space } from "antd";
import { BiTime } from "react-icons/bi";
import Partnership from "../common/Partnership";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import styled from "@emotion/styled";
dayjs.extend(customParseFormat);

//datePicker
const { RangePicker } = DatePicker;
const range = (start, end) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};
const disabledDate = current => {
  // Can not select days before today and today
  return current && current < dayjs().endOf("day");
};
const disabledDateTime = () => ({
  disabledHours: () => range(0, 24).splice(4, 20),
  disabledMinutes: () => range(30, 60),
  disabledSeconds: () => [55, 56],
});
const disabledRangeTime = (_, type) => {
  if (type === "start") {
    return {
      disabledHours: () => range(0, 60).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [55, 56],
    };
  }
  return {
    disabledHours: () => range(0, 60).splice(20, 4),
    disabledMinutes: () => range(0, 31),
    disabledSeconds: () => [55, 56],
  };
};
const StyledRangePicker = styled(RangePicker)`
  .ant-picker-input input {
    color: "#334155" !important;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    width: 100px;
  }
`;
const Menu = ({ type = "STAY", strfId, contentData }) => {
  // useNavigate
  const navigate = useNavigate();
  const navigateBooking = () => {
    navigate(`/booking?strfId=${strfId}`);
  };
  //useState
  const [dates, setDates] = useState(null);

  const handleDateChange = (values, formatString) => {
    console.log("선택된 날짜:", values); // dayjs 객체 배열
    console.log("포맷된 날짜:", formatString); // 'YYYY-MM-DD' 형식의 문자열 배열
    setDates(values);
  };
  useEffect(() => {
    console.log("dates", dates);
  }, [dates]);

  return (
    <div className="flex flex-col gap-[30px]">
      {/* 메뉴: 숙소 */}
      {type === "STAY" && (
        <div className="w-full flex flex-col gap-[30px]">
          <div className="w-full flex items-center border border-slate-300 rounded-lg">
            <div className="w-full flex justify-center py-[20px] border-r border-slate-300 text-slate-700 text-[18px]">
              <StyledRangePicker
                placeholder={["입실일", "퇴실일"]}
                disabledDate={disabledDate}
                variant="borderless"
                onChange={handleDateChange}
                separator={"~"}
              />
            </div>
            <div className="w-full flex justify-center py-[20px] text-slate-700 text-[18px">
              인원
            </div>
          </div>
          <ul>
            {contentData ? (
              contentData?.map((item, index) => {
                return (
                  <li className="flex gap-[10px] px-[10px] py-[20px] justify-between items-end">
                    {/* 객실 정보 */}
                    <div className="flex flex-col gap-[15px]">
                      <div className="flex flex-col gap-[5px]">
                        <p className="text-[28px] font-semibold text-slate-700">
                          객실 이름
                        </p>
                        <div className="flex gap-[5px] items-center">
                          <BiTime className="text-[24px] text-slate-500" />
                          <p className="text-[18px] text-slate-500">
                            <span>입실 시간</span>
                            <span>-</span>
                            <span>퇴실 시간</span>
                          </p>
                        </div>
                      </div>
                      <p className="text-[24px] font-semibold text-slate-700">
                        {(99000).toLocaleString()}원
                      </p>
                    </div>
                    {/* 객실 예약 */}
                    <button
                      type="button"
                      className="px-[30px] py-[10px] bg-primary text-white rounded-lg text-[18px]"
                      onClick={navigateBooking}
                    >
                      예약하기
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="flex gap-[10px] px-[10px] py-[20px] justify-between items-end">
                {/* 객실 정보 */}
                <div className="flex flex-col gap-[15px]">
                  <div className="flex flex-col gap-[5px]">
                    <p className="text-[28px] font-semibold text-slate-700">
                      객실 이름(데이터가 없습니다)
                    </p>
                    <div className="flex gap-[5px] items-center">
                      <BiTime className="text-[24px] text-slate-500" />
                      <p className="text-[18px] text-slate-500">
                        <span>입실 시간</span>
                        <span>-</span>
                        <span>퇴실 시간</span>
                      </p>
                    </div>
                  </div>
                  <p className="text-[24px] font-semibold text-slate-700">
                    {(99000).toLocaleString()}원
                  </p>
                </div>
                {/* 객실 예약 */}
                <button
                  type="button"
                  className="px-[30px] py-[10px] bg-primary text-white rounded-lg text-[18px]"
                  onClick={navigateBooking}
                >
                  예약하기
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
      {/* 메뉴: 식당 */}
      {type === "RESTAUR" && (
        <div className="w-full flex flex-col gap-[20px]">
          <h2 className="text-[28px] font-semibold text-slate-700">대표메뉴</h2>
          <ul className="flex gap-[20px] flex-wrap">
            <li className="flex flex-col gap-[10px]">
              <div className="w-full h-[300px] bg-slate-200 rounded-[16px]">
                <Skeleton.Image
                  active={false}
                  size="large"
                  style={{ width: "342px", height: "300px" }}
                />
              </div>
              <p className="text-[24px] text-slate-700">메뉴 이름</p>
              <p className="text-[18px] text-slate-700 font-semibold">가격</p>
            </li>
            <li className="flex flex-col gap-[10px]">
              <div className="w-full h-[300px] bg-slate-200 rounded-[16px]">
                <Skeleton.Image
                  active={false}
                  size="large"
                  style={{ width: "342px", height: "300px" }}
                />
              </div>
              <p className="text-[24px] text-slate-700">메뉴 이름</p>
              <p className="text-[18px] text-slate-700 font-semibold">가격</p>
            </li>
            <li className="flex flex-col gap-[10px]">
              <div className="w-full h-[300px] bg-slate-200 rounded-[16px]">
                <Skeleton.Image
                  active={false}
                  size="large"
                  style={{ width: "342px", height: "300px" }}
                />
              </div>
              <p className="text-[24px] text-slate-700">메뉴 이름</p>
              <p className="text-[18px] text-slate-700 font-semibold">가격</p>
            </li>
            <li className="flex flex-col gap-[10px]">
              <div className="w-full h-[300px] bg-slate-200 rounded-[16px]">
                <Skeleton.Image
                  active={false}
                  size="large"
                  style={{ width: "342px", height: "300px" }}
                />
              </div>
              <p className="text-[24px] text-slate-700">메뉴 이름</p>
              <p className="text-[18px] text-slate-700 font-semibold">가격</p>
            </li>
          </ul>
        </div>
      )}
      {/* 메뉴: 관광지 */}
      {type === "TOUR" && (
        <div className="w-full flex flex-col gap-[20px]">
          <h2 className="text-[28px] font-semibold text-slate-700">예매</h2>
          <ul>
            <li className="flex py-[30px] border-b border-slate-200 items-center justify-between">
              <div className="flex flex-col gap-[10px]">
                <div className="flex gap-[5px] items-center">
                  <p className="text-[24px] text-slate-700">메뉴 이름</p>
                  <Partnership />
                </div>

                <p className="text-[18px] text-slate-700 font-semibold">가격</p>
                <p className="text-[18px] text-slate-400">유효기간</p>
              </div>
              <div className="w-[150px] h-[150px] bg-slate-200 rounded-[16px] overflow-hidden">
                <Skeleton.Image
                  active={false}
                  size="large"
                  style={{ width: "150px", height: "150px" }}
                />
              </div>
            </li>
          </ul>
        </div>
      )}
      {/* 메뉴: 축제 */}
      {type === "FESTIVAL" && (
        <div className="w-full flex flex-col gap-[20px]">
          <h2 className="text-[28px] font-semibold text-slate-700">
            이용 요금 안내
          </h2>
          <ul>
            <li className="flex py-[30px] border-b border-slate-200 items-center justify-between">
              <div className="flex flex-col gap-[10px]">
                <div className="flex gap-[5px] items-center">
                  <p className="text-[24px] text-slate-700">메뉴 이름</p>
                  <Partnership />
                </div>

                <p className="text-[18px] text-slate-700 font-semibold">가격</p>
                <p className="text-[18px] text-slate-400">유효기간</p>
              </div>
              <div className="w-[150px] h-[150px] bg-slate-200 rounded-[16px] overflow-hidden">
                <Skeleton.Image
                  active={false}
                  size="large"
                  style={{ width: "150px", height: "150px" }}
                />
              </div>
            </li>
          </ul>
        </div>
      )}
      <div className="w-full h-[10px] bg-slate-100"></div>
    </div>
  );
};

export default memo(Menu);
