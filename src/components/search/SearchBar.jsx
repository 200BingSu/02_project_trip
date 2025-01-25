import { Input } from "antd";
import React, { useState } from "react";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const SearchBar = React.memo(({ setSearchState }) => {
  // useState
  const [searchBarFocus, setSearchBarFocus] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // 검색창 비우기
  const onChange = e => {
    // console.log(e);
  };
  return (
    <div className="w-full relative">
      <Input
        classNames="px-[12px]"
        placeholder="지금 어디로 여행을 떠나고 싶으신가요?"
        variant="borderless"
        allowClear
        onChange={e => {
          onChange();
          setSearchValue(e.target.value ? true : false);
        }}
        onFocus={() => {
          setSearchBarFocus(true);
        }}
        onBlur={() => {
          setSearchBarFocus(false);
        }}
        className={`h-[60px] ${searchValue ? "bg-white" : searchBarFocus ? "bg-white" : "bg-slate-100"}`}
        onKeyDown={e => {
          console.log(e.code);
          if (e.code === "Enter") {
            setSearchState(true);
          }
        }}
      />
      {searchValue ? null : (
        <FiSearch className="text-[24px] text-gray-400 absolute top-[50%] translate-y-[-50%] right-[18px]" />
      )}
    </div>
  );
});

export default SearchBar;
