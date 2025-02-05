import React from "react";
import { BsFillPatchPlusFill } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { IoReaderOutline } from "react-icons/io5";
import { RiMapPinUserFill } from "react-icons/ri";
import { HiOutlineMap } from "react-icons/hi2";
import { Link } from "react-router-dom";

const DockBar = React.memo(() => {
  return (
    <div className="flex max-w-3xl w-full h-[100px] sticky bottom-0 left-0 bg-white z-50 shadow-[0px_-4px_8px_0px_rgba(99,99,99,0.05)]">
      <Link
        to="/search/contents"
        className="text-slate-400 flex flex-1 flex-col justify-center items-center gap-1.5"
      >
        <FiSearch className="text-4xl" />
        검색
      </Link>
      <Link
        to="/search/location"
        className="text-slate-400 flex flex-1 flex-col justify-center items-center gap-1.5"
      >
        <HiOutlineMap className="text-4xl" />
        일정
      </Link>
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
