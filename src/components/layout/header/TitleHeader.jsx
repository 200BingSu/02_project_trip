import React, { useEffect, useState } from "react";
import { BiSolidShareAlt } from "react-icons/bi";
import { CgMenuGridO } from "react-icons/cg";
import { HiOutlineMap } from "react-icons/hi2";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoCloseSharp, IoReaderOutline } from "react-icons/io5";

/**
 * ## props
 * ### icon1
 * 공유
 * ### icon2
 * 맵
 * ### icon3
 * 여행기
 * ### icon4
 * 그리드 버튼
 * ### icon1Click~icon4Click
 * 적용할 함수
 */

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
            <li className="flex items-center text-[36px] text-slate-700">
              <button type="button" onClick={icon1Click}>
                <BiSolidShareAlt />
              </button>
            </li>
          ) : null}
          {icon2 ? (
            <li className="flex items-center text-[36px] text-slate-700">
              <button type="button" onClick={icon2Click}>
                <HiOutlineMap />
              </button>
            </li>
          ) : null}
          {icon3 ? (
            <li className="flex items-center text-[36px] text-slate-700">
              <button type="button" onClick={icon3Click}>
                <IoReaderOutline />
              </button>
            </li>
          ) : null}
          {icon4 ? (
            <li className="flex items-center text-[36px] text-slate-700">
              <button type="button" onClick={icon4Click}>
                <CgMenuGridO />
              </button>
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
 * ## rightContent
 * - 기본은 null
 * - 사용: rightContent = {<RightContent icon1=true icon2=true>}
 * - RightContent props는 해당 컴포넌트에서 확인
 */
const TitleHeader = React.memo(
  ({ icon, title, onClick, rightContent = null }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        // 스크롤 위치가 0보다 크면 isScrolled를 true로 설정
        if (window.scrollY > 0) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      };
      // 스크롤 이벤트 리스너 추가
      window.addEventListener("scroll", handleScroll);

      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);

    return (
      <div
        className={`flex max-w-3xl w-full mx-auto items-center justify-between 
    h-[60px] px-[30px] sticky top-0 left-0 z-10 transition-colors duration-100 ${isScrolled ? "bg-white" : "bg-transparent"}`} // 스크롤 상태에 따라 배경색 변경
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
