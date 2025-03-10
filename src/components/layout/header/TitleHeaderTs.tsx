import { memo, ReactNode, useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";

interface TitleHeaderTsProps {
  title?: string;
  icon?: string;
  onClick?: () => void;
  rightContent?: ReactNode | null;
  scrollEvent?: boolean;
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
  scrollEvent = true,
}: TitleHeaderTsProps): JSX.Element => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  // 스크롤
  useEffect(() => {
    if (!scrollEvent) {
      setIsScrolled(false);
      return;
    }

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
  }, [scrollEvent]);
  return (
    <div
      className={`
        max-w-[768px] w-full mx-auto h-[60px]
        flex  items-center justify-between 
        px-[16px] 
        sticky top-0 left-0 z-10
        transition-colors duration-100 ${scrollEvent ? (isScrolled ? "bg-white" : "bg-transparent") : "bg-white"}`}
    >
      {/* 좌측 */}
      <div className="flex gap-[12px] items-center">
        <button
          type="button"
          className="text-3xl text-slate-700"
          onClick={onClick}
        >
          {icon === "back" ? <IoIosArrowRoundBack /> : <IoCloseSharp />}
        </button>
        <div className="text-lg font-bold text-slate-700">
          {title ? `${title}` : ``}
        </div>
      </div>
      {/* 우측 */}
      <div className={`flex items-center text-3xl text-slate-700`}>
        {rightContent}
      </div>
    </div>
  );
};
export default memo(TitleHeaderTs);
