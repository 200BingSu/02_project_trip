import { useEffect, useState } from "react";
import { AiOutlineHeart, AiOutlineImport } from "react-icons/ai";
import { IoIosArrowRoundBack } from "react-icons/io";

const ContentsHeader = ({ scrollEvent = true }): JSX.Element => {
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
      className={`max-w-[768px] w-full px-4  fixed top-0 left-1/2 -translate-x-1/2 z-10
        transition-colors duration-300 ${scrollEvent ? (isScrolled ? "bg-white text-slate-700" : "bg-transparent text-white") : "bg-transparent"}`}
    >
      <div className="flex justify-between items-center h-[60px]">
        <div className="flex items-center gap-3">
          <IoIosArrowRoundBack className="text-3xl " />
          <h2 className="font-semibold text-xl">홀리데이 인 광주 호텔</h2>
        </div>
        <div className="flex items-center gap-3">
          <AiOutlineHeart className=" text-2xl" />
          <AiOutlineImport className=" text-2xl" />
        </div>
      </div>
    </div>
  );
};

export default ContentsHeader;
