import axios from "axios";
import { useEffect, useState } from "react";
import {
  AiOutlineHeart,
  AiOutlineImport,
  AiTwotoneHeart,
} from "react-icons/ai";
import { IoIosArrowRoundBack } from "react-icons/io";
import { WISHLIST } from "../../../constants/api";
import { useRecoilState } from "recoil";
import { userAtom } from "../../../atoms/userAtom";
import { useNavigate } from "react-router-dom";

const ContentsHeader = ({ contentData, strfId }) => {
  //recoil
  const [userInfo, setUserInfo] = useRecoilState(userAtom);
  //useNavigate
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate(-1);
  };
  // useState
  const [scrollY, setScrollY] = useState(0);
  // scrollY 이벤트
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  // postWishList
  const postWishList = async () => {
    const sendData = {
      strf_id: strfId,
    };
    console.log("찜하기 데이터:", sendData);
    try {
      const res = await axios.post(`${WISHLIST.postWishList}`, sendData, {
        headers: {
          Authorization: `Bearer ${userInfo.accessToken}`,
        },
      });
      console.log("찜하기", res.data);
    } catch (error) {
      console.log("찜하기", error);
    }
  };

  return (
    <div
      className={`px-[32px] 
        max-w-3xl w-full mx-auto
        flex items-center justify-between gap-10
        fixed top-0 left-[50%] translate-x-[-50%] z-50 
        ${scrollY > 0 ? "bg-white" : null}`}
    >
      <div className="flex gap-[40px]">
        <div className="text-[36px] cursor-pointer" onClick={navigateBack}>
          <IoIosArrowRoundBack
            className={scrollY > 0 ? "text-slate-700" : "text-white"}
          />
        </div>
        <div
          className={`text-[24px] font-bold ${scrollY > 0 ? "text-slate-700'" : "text-white"}`}
        >
          {contentData?.strfTitle || "제목"}
        </div>
      </div>
      <div className="flex gap-[20px]">
        <div className="text-[36px] cursor-pointer " onClick={postWishList}>
          <AiOutlineHeart
            className={scrollY > 0 ? "text-slate-700" : "text-white"}
          />
        </div>
        <div className="text-[36px] cursor-pointer">
          <AiOutlineImport
            className={scrollY > 0 ? "text-slate-700" : "text-white"}
          />
        </div>
      </div>
    </div>
  );
};

export default ContentsHeader;
