import axios from "axios";
import { memo, useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineImport,
  AiTwotoneHeart,
} from "react-icons/ai";
import { IoIosArrowRoundBack } from "react-icons/io";
import { WISHLIST } from "../../../constants/api";
import { useRecoilState } from "recoil";
import { userAtom } from "../../../atoms/userAtom";
import { useLocation, useNavigate } from "react-router-dom";
import { getCookie } from "../../../utils/cookie";
import { Dropdown } from "antd";
import { MdContentCopy } from "react-icons/md";
import { searchAtom } from "../../../atoms/searchAtom";

const ContentsHeader = ({ contentData, strfId, getDetailMember }) => {
  const accessToken = getCookie("accessToken");
  //recoil
  const [userInfo, setUserInfo] = useRecoilState(userAtom);
  const [searchRecoil, setSearchRecoil] = useRecoilState(searchAtom);
  const userId = userInfo.userId;
  useEffect(() => {
    console.log("searchRecoil", searchRecoil);
  }, [searchRecoil]);

  //useNavigate
  const navigate = useNavigate();
  const navigateBack = () => {
    if (searchRecoil.searchWord !== "") {
      navigate(`/search/strf`);
    } else {
      navigate(`/`);
    }
  };

  //useLocation
  const location = useLocation();
  const locationState = location.state;
  // console.log("locationState", locationState);
  const nowUrl = location.search;
  // console.log("URL:", nowUrl);
  const localeIp = `${window.location.origin}/contents/index?${nowUrl}`;
  //복사하기
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(localeIp);
      // console.log("복사 성공");
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  const items = [
    {
      label: (
        <div
          onClick={() => handleCopy()}
          className="flex flex-col gap-[10px] items-center justify-center"
        >
          <p className="bg-slate-100 px-[15px] py-[10px] rounded-lg text-slate-600">
            {localeIp}
          </p>
          <p className="flex items-center gap-1 border-b border-slate-300">
            <i className="text-slate-500">
              <MdContentCopy />
            </i>
            <span className="text-slate-500">URL 복사하기</span>
          </p>
        </div>
      ),
      key: "0",
    },
  ];
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
      strfId: strfId,
    };
    console.log("찜하기 데이터:", sendData);
    try {
      const res = await axios.post(
        `/api/wish-list`,
        { ...sendData },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log("찜하기", res.data);
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        getDetailMember();
      }
    } catch (error) {
      console.log("찜하기", error);
    }
  };

  return (
    <div
      className={`px-[32px] 
        w-full max-w-[768px] h-[60px] mx-auto
        flex items-center justify-between gap-10
        fixed top-0 left-[50%] translate-x-[-50%] z-10 
        ${scrollY > 0 ? "bg-white" : ""}`}
    >
      <div className="flex gap-10 items-center">
        <div className="text-4xl cursor-pointer" onClick={navigateBack}>
          <IoIosArrowRoundBack
            className={scrollY > 0 ? "text-slate-700" : "text-white"}
          />
        </div>
        <div
          className={`text-xl font-bold ${scrollY > 0 ? "text-slate-700" : "text-white"}`}
        >
          {contentData?.strfTitle || "제목"}
        </div>
      </div>
      <div className="flex gap-[20px] items-center">
        {userId !== 0 ? (
          contentData?.wishIn ? (
            <div className="text-2xl cursor-pointer " onClick={postWishList}>
              <AiFillHeart
                className={scrollY > 0 ? "text-slate-700" : "text-white"}
              />
            </div>
          ) : (
            <div className="text-2xl cursor-pointer " onClick={postWishList}>
              <AiOutlineHeart
                className={scrollY > 0 ? "text-slate-700" : "text-white"}
              />
            </div>
          )
        ) : null}

        <div className="text-2xl cursor-pointer items-center">
          <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
            overlayStyle={{ marginTop: "10px" }}
            className="flex items-center"
          >
            <a onClick={e => e.preventDefault()}>
              <button type="button">
                <AiOutlineImport
                  className={scrollY > 0 ? "text-slate-700" : "text-white"}
                />
              </button>
            </a>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default memo(ContentsHeader);
