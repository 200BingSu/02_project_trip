import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

const SearchStrf = () => {
  //recoil
  const [search, setSearch] = useRecoilState(searchAtom);
  //쿠키
  const accessToken = getCookie("accessToken");
  //useNavigate
  const navigate = useNavigate();
  return (
    <div className="w-full flex flex-col gap-[30px]">
      {/* 상단 */}
      <div className="w-full px-[32px] py-[30px] flex items-center gap-[40px] relative">
        {/* 뒤로가기 */}
        <div
          className="text-[36px] cursor-pointer"
          onClick={() => {
            navigate(-1);
          }}
        >
          <IoIosArrowRoundBack />
        </div>
        {/* 검색바 */}
      </div>
    </div>
  );
};

export default SearchStrf;
