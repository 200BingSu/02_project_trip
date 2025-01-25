import { Input } from "antd";
import React, { useState } from "react";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import SearchBar from "../../components/search/SearchBar";
import SearchNone from "../../components/search/SearchNone";
import SearchList from "../../components/search/SearchList";

const SearchLocation = () => {
  //useNavigate
  const navigate = useNavigate();
  // useState
  const [searchState, setSearchState] = useState(false);

  return (
    <div>
      {/* 상단바 */}
      <div className="flex px-[32px] py-[30px] gap-[40px] items-center bg-white">
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
        <SearchBar setSearchState={setSearchState} />
      </div>
      {/* 검색 결과 */}
      {searchState ? <SearchList /> : <SearchNone />}
    </div>
  );
};

export default SearchLocation;
