import React from "react";
import { Skeleton } from "antd";
import { BiTime } from "react-icons/bi";
import Partnership from "../common/Partnership";

const Menu = ({ type = "STAY" }) => {
  return (
    <>
      {/* 메뉴: 숙소 */}
      {type === "STAY" && (
        <div>
          <div>숙박: 날짜, 인원</div>
          <ul>
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
              >
                예약하기
              </button>
            </li>
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
    </>
  );
};

export default Menu;
