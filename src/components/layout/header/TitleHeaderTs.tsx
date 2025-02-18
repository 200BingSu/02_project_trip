import { ReactNode, useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";

interface TitleHeaderTsProps {
  title?: string;
  icon?: string;
  onClick?: () => void;
  rightContent?: ReactNode | null;
}
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
const TitleHeaderTs = ({
  icon = "back",
  title = "",
  onClick = () => {},
  rightContent = null,
}: TitleHeaderTsProps): JSX.Element => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  // 스크롤
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
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
};
export default TitleHeaderTs;
