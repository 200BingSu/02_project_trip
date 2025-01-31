import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { BiSolidShareAlt } from "react-icons/bi";
import { CgMenuGridO } from "react-icons/cg";
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
  ({
    icon,
    title,
    onClick,
    left = false,
    leftIcon = <BiSolidShareAlt />,
    leftIconClick,
    gridClick,
  }) => {
    return (
      <div
        className="flex max-w-3xl w-full mx-auto items-center justify-between 
    h-[60px] px-[30px] bg-white fixed top-0 left-[50%] translate-x-[-50%] z-50"
      >
        {/* 좌측 */}
        <div className="flex gap-10 items-center">
          <button
            type="button"
            className="text-[60px] text-slate-700"
            onClick={onClick}
          >
            {icon === "back" ? <IoIosArrowRoundBack /> : <IoIosClose />}
          </button>
          <div className="text-[24px] font-bold text-slate-700">
            {title ? `${title}` : ``}
          </div>
        </div>
        {/* 우측 */}
        <div
          className={`flex gap-[30px] items-center text-[36px] text-slate-700 ${left ? "" : "hidden"}`}
        >
          <button type="button" onClick={leftIconClick}>
            {leftIcon}
          </button>
          <button type="button" onClick={gridClick}>
            <CgMenuGridO />
          </button>
        </div>
      </div>
    );
  },
);
export default TitleHeader;
