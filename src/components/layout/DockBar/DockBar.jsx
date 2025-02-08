import { message } from "antd";
import React from "react";
import { BsFillPatchPlusFill } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { IoReaderOutline } from "react-icons/io5";
import { RiMapPinUserFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../../atoms/userAtom";
import { LuMapPinned } from "react-icons/lu";

const DockBar = React.memo(() => {
  //recoil
  const { userId, accessToken } = useRecoilValue(userAtom);
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

  return (
    <div className="flex max-w-3xl w-full h-[100px] sticky bottom-0 left-0 bg-white z-50 shadow-[0px_-4px_8px_0px_rgba(99,99,99,0.05)]">
      <Link
        to="/search/contents"
        className="text-slate-400 flex flex-1 flex-col justify-center items-center gap-1.5"
      >
        <FiSearch className="text-4xl" />
        검색
      </Link>
      <button
        type="button"
        onClick={() => {
          if (userId === 0) {
            info();
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
        to="/user"
        className="text-slate-400 flex flex-1 flex-col justify-center items-center gap-1.5"
      >
        <RiMapPinUserFill className="text-4xl" />
        마이페이지
      </Link>
    </div>
  );
});
export default DockBar;
