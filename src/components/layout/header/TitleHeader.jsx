import React from "react";
import { BiSolidShareAlt } from "react-icons/bi";
import { CgMenuGridO } from "react-icons/cg";
import { HiOutlineMap } from "react-icons/hi2";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoCloseSharp, IoReaderOutline } from "react-icons/io5";
export const RightContent = React.memo(
  ({
    icon1 = false,
    icon2 = false,
    icon3 = false,
    icon4 = false,
    icon1Click,
    icon2Click,
    icon3Click,
    icon4Click,
  }) => {
    return (
      <div>
        <ul className="flex gap-[30px] items-center">
          {icon1 ? (
            <li
              className="flex items-center text-[36px] text-slate-700"
              onClick={icon1Click}
            >
              <button type="button">
                <BiSolidShareAlt />
              </button>
            </li>
          ) : null}
          {icon2 ? (
            <li
              className="flex items-center text-[36px] text-slate-700"
              onClick={icon2Click}
            >
              <button type="button" onClick={icon2Click}>
                <HiOutlineMap />
              </button>
            </li>
          ) : null}
          {icon3 ? (
            <li
              className="flex items-center text-[36px] text-slate-700"
              onClick={icon3Click}
            >
              <IoReaderOutline />
            </li>
          ) : null}
          {icon4 ? (
            <li
              className="flex items-center text-[36px] text-slate-700"
              onClick={icon4Click}
            >
              <CgMenuGridO />
            </li>
          ) : null}
        </ul>
      </div>
    );
  },
);

/**
 * props
 * ## onClick
 * - 아이콘 클릭 시 작동할 함수
 * ## icon
 * - "back": <-
 * - 공백: X
 * ## title
 * - 문자열 넣으면 출력
 * - 비우면 공백
 * ## left
 * - 기본: false
 * - true: 우측 아이콘 활성화
 * ## leftIcon
 * - 기본: 공유 아이콘
 * ## leftIconClick
 * - 우측 아이콘 클릭 시 함수
 * ## gridClick
 * - grid 아이콘 클릭 시 함수
 */
const TitleHeader = React.memo(
  ({ icon, title, onClick, rightContent = null }) => {
    return (
      <div
        className="flex max-w-3xl w-full mx-auto items-center justify-between 
    h-[60px] px-[30px] bg-white fixed top-0 left-[50%] translate-x-[-50%] z-50"
      >
        {/* 좌측 */}
        <div className="flex gap-10 items-center">
          <button
            type="button"
            className="text-3xl text-slate-700"
            onClick={onClick}
          >
            {icon === "back" ? <IoIosArrowRoundBack /> : <IoCloseSharp />}
          </button>
          <div className="text-2xl font-bold text-slate-700">
            {title ? `${title}` : ``}
          </div>
        </div>
        {/* 우측 */}
        <div className={`flex items-center text-[36px] text-slate-700`}>
          {rightContent}
        </div>
      </div>
    );
  },
);
export default TitleHeader;
