import React, { memo } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { BiTime } from "react-icons/bi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

dayjs.extend(isBetween);

const BusinessTime = ({
  type = "STAY",
  contentData,
  openBusinessTime,
  setOpenBusinessTime,
}) => {
  // 영업 시간 변환
  const timeFormat = time => {
    if (!time) return "N/A";
    return dayjs(time, "HH:mm").isValid()
      ? dayjs(time, "HH:mm").format("HH:mm")
      : "Invalid format";
  };
  const now = dayjs();
  const openTime = timeFormat("09:00:00");
  const closeTime = timeFormat("23:59:00");
  const status = now.isBetween(openTime, closeTime, null, "[]")
    ? "영업중"
    : "영업 종료";

  return (
    <>
      {/* 숙소 */}
      {type === "STAY" && (
        <div className="flex gap-[5px] items-center">
          <BiTime className="text-xl text-slate-500" />
          <span className="text-base text-slate-500">매일</span>
          <span className="text-base text-slate-500">
            {timeFormat("09:00:00")}
          </span>
          <span className="text-base text-slate-500">~</span>
          <span className="text-base text-slate-500">
            {timeFormat("11:59:00")}
          </span>
        </div>
      )}
      {/* 식당 */}
      {type === "RESTAUR" && (
        <div className="flex flex-col ">
          <div className="flex gap-[5px] items-center">
            <BiTime className="text-xl text-slate-500" />
            <span className="text-base text-slate-700 font-semibold">
              {status}
            </span>
            <span className="text-base text-slate-500">|</span>
            <span className="text-base text-slate-500">
              {timeFormat("11:59:00")} 영업 종료
            </span>
            <span
              className="text-[18px] text-slate-500 cursor-pointer"
              onClick={() => {
                setOpenBusinessTime(!openBusinessTime);
              }}
            >
              {openBusinessTime ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </span>
          </div>
          {openBusinessTime && (
            <div className="flex gap-[5px] items-center">
              <BiTime className="text-xl text-slate-500" />
              <span className="text-base text-slate-700 font-semibold">
                매일
              </span>
              <span className="text-base text-slate-500">
                {timeFormat("09:00:00")} - {timeFormat("11:59:00")}
              </span>
            </div>
          )}
        </div>
      )}
      {/* 관광지 */}
      {type === "TOUR" && (
        <div className="flex gap-[5px] items-center">
          <BiTime className="text-xl text-slate-500" />
          <span className="text-base text-slate-500">매일</span>
          <span className="text-base text-slate-500">
            {contentData?.open && timeFormat(contentData?.open)}
          </span>
          <span className="text-[18px] text-slate-500">~</span>
          <span className="text-[18px] text-slate-500">
            {contentData?.close && timeFormat(contentData?.close)}
          </span>
        </div>
      )}
      {/* 축제 */}
      {type === "FESTIVAL" && (
        <div className="flex flex-col ">
          <div className="flex gap-[5px] items-center">
            <BiTime className="text-xl text-slate-500" />
            <span className="text-base text-slate-700 font-semibold">
              {status}
            </span>
            <span className="text-base text-slate-500">|</span>
            <span className="text-base text-slate-500">
              {timeFormat("11:59:00")} 영업 종료
            </span>
            <span
              className="text-[18px] text-slate-500 cursor-pointer"
              onClick={() => {
                setOpenBusinessTime(!openBusinessTime);
              }}
            >
              {openBusinessTime ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </span>
          </div>
          {openBusinessTime && (
            <div className="flex flex-col">
              <div className="flex gap-[5px] items-center">
                <BiTime className="text-xl text-slate-500 opacity-0" />
                <span className="text-base text-slate-500">
                  {timeFormat("09:00:00")} - {timeFormat("11:59:00")}
                </span>
              </div>
              <div className="flex gap-[5px] items-center">
                <BiTime className="text-xl text-slate-500 opacity-0" />
                <span className="text-base text-slate-700 font-bold">
                  * 입장마감
                </span>
                <span className="text-base text-slate-700">
                  {timeFormat("16:59:00")}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default memo(BusinessTime);
