import { message, Modal } from "antd";
import React, { useState } from "react";
import { BsFillPatchPlusFill } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { IoLogoWechat, IoReaderOutline } from "react-icons/io5";
import { RiMapPinUserFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../../../atoms/userAtom";
import { LuMapPinned } from "react-icons/lu";
import { getCookie } from "../../../utils/cookie";
import { searchAtom } from "../../../atoms/searchAtom";

const DockBar = React.memo(() => {
  // 채팅 구현 안되서 띄우는 모달창
  const [isModalOpen, setIsModalOpen] = useState(false);
  //쿠키
  const accessToken = getCookie("accessToken");
  //recoil
  const { userId } = useRecoilValue(userAtom);
  const [searchRecoil, setSearchRecoil] = useRecoilState(searchAtom);
  //useNavigate
  const navigate = useNavigate();
  //antD
  const [messageApi, contextHolder] = message.useMessage();
  const info = () => {
    console.log("info 작동");
    messageApi.open({
      type: "info",
      content: "로그인이 필요한 서비스입니다.",
      style: {
        marginTop: "20vh",
      },
    });
  };

  const showModal = () => {
    message.error("현재 지원되는 서비스가 아닙니다.");
  };

  return (
    <div>
      <div className="flex max-w-3xl w-full h-[100px] fixed bottom-0 left-1/2 -translate-x-1/2 bg-white z-50 shadow-[0px_-4px_8px_0px_rgba(99,99,99,0.05)]">
        <Link
          to="/search/strf"
          className="text-slate-400 flex flex-1 flex-col justify-center items-center gap-1.5"
        >
          <FiSearch className="text-4xl" />
          검색
        </Link>
        <button
          type="button"
          onClick={() => {
            if (!accessToken) {
              info();
              message.error("로그인 후 이용 가능한 서비스 입니다");
            } else {
              navigate("/search/location");
            }
          }}
          className="text-slate-400 flex flex-1 flex-col justify-center items-center gap-1.5"
        >
          <LuMapPinned className="text-4xl" />
          일정
        </button>
        <Link
          to="/"
          className="bg-primary text-white w-[102px] h-[102px] rounded-full flex flex-col justify-center items-center gap-1.5 relative bottom-5"
          onClick={() => {
            setSearchRecoil({ ...searchRecoil, searchWord: "" });
          }}
        >
          <BsFillPatchPlusFill className="text-4xl" />홈
        </Link>
        <Link
          to="/scheduleboard/index"
          className="text-slate-400 flex flex-1 flex-col justify-center items-center gap-1.5"
        >
          <IoReaderOutline className="text-4xl" />
          여행기
        </Link>
        <Link
          to="#"
          className="text-slate-400 flex flex-1 flex-col justify-center items-center gap-1.5"
          onClick={showModal}
        >
          <IoLogoWechat className="text-4xl" />
          챗봇
        </Link>
      </div>
    </div>
  );
});

export default DockBar;
