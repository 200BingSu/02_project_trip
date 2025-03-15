import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart, AiOutlineImport } from "react-icons/ai";
import { IoIosArrowRoundBack } from "react-icons/io";
import { StrInfoProps } from "../../contents/StrInfo";
import { Popover } from "antd";
import "../../../styles/antd-styles.css";

import { FaLink } from "react-icons/fa6";
import jwtAxios from "../../../apis/jwt";
import { useNavigate } from "react-router-dom";

interface ContentsHeaderProps extends StrInfoProps {
  scrollEvent?: boolean; // 기본값을 true로 설정
  getDetailMember: () => void; // 옵셔널로 정의
}

const ContentsHeader = ({
  scrollEvent = true,
  strfId,
  contentData,
  getDetailMember,
}: ContentsHeaderProps): JSX.Element => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const navigate = useNavigate();

  const postWishList = async () => {
    const sendData = {
      strfId: strfId,
    };
    console.log("찜하기 데이터:", sendData);
    try {
      const res = await jwtAxios.post(`/api/wish-list`, { ...sendData });
      console.log("찜하기", res.data);
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        getDetailMember();
      }
    } catch (error) {
      console.log("찜하기", error);
    }
  };

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

  const currentUri = window.location.href; // 현재 URL을 가져옵니다.
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUri);
    } catch (err) {
      console.error("복사 실패", err);
    }
  };
  console.log("currentUri", currentUri);
  return (
    <div
      className={`max-w-[768px] w-full px-4  fixed top-0 left-1/2 -translate-x-1/2 z-10
        duration-300 ${scrollEvent ? (isScrolled ? "bg-white text-slate-700" : "bg-transparent text-white") : "bg-transparent"}`}
    >
      <div className="flex justify-between items-center h-[60px]">
        <div className="flex items-center gap-3">
          <IoIosArrowRoundBack
            className="text-3xl "
            onClick={() => navigate(-1)}
          />
          <h2 className="font-semibold text-xl">{contentData?.strfTitle}</h2>
        </div>
        <div className="flex items-center gap-3">
          {contentData?.wishIn ? (
            <AiFillHeart
              className={`text-2xl ${scrollY > 0 ? "text-secondary3" : "text-white"}`}
              onClick={postWishList}
            />
          ) : (
            <AiOutlineHeart
              className={`text-2xl ${scrollY > 0 ? "text-slate-700" : "text-white"}`}
              onClick={postWishList}
            />
          )}

          <Popover
            className="!rounded-2xl"
            content={
              <div className="flex items-center justify-between gap-3 bg-slate-100 pl-3 pr-1 py-1 rounded-lg">
                <p className="line-clamp-1 w-[189px]">{currentUri}</p>
                <button
                  onClick={() => handleCopy()}
                  className=" flex items-center gap-1 bg-primary px-3 py-1 rounded-lg text-white"
                >
                  <FaLink />
                  복사
                </button>
              </div>
            }
            trigger="click"
          >
            <AiOutlineImport className=" text-2xl" />
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default ContentsHeader;
