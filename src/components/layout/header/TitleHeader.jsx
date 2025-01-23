import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoIosClose } from "react-icons/io";

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
 */
const TitleHeader = React.memo(({ icon, title, onClick }) => {
  return (
    <div className="flex max-w-3xl mx-auto items-center h-[60px] px-[30px] gap-10">
      <div className="text-[36px]" onClick={onClick}>
        {icon === "back" ? <IoIosArrowRoundBack /> : <IoIosClose />}
      </div>
      <div className="text-[24px] font-bold">{title ? `${title}` : ``}</div>
    </div>
  );
});
export default TitleHeader;
