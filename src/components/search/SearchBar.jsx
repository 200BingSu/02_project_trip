import { Input } from "antd";
import React, { useState } from "react";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const SearchBar = React.memo(
  ({ searchValue, setSearchValue, setSearchState }) => {
    //useNavigate
    const navigate = useNavigate();
    // useState
    const [searchBarFocus, setSearchBarFocus] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [popularData, setPopularData] = useState([]);
    // 검색창 비우기
    const onChange = e => {};
    // 인기 검색어
    const getSearchBasicPopular = async () => {
      try {
        const res = await axios.get(`/api/search/popular`);
        const resultData = res.data;
        setPopularData(resultData);
      } catch (error) {
        console.log("인기검색어", error);
      }
    };
    return (
      <div className="w-full px-[32px] py-[30px] flex items-center gap-[40px] relative ">
        {/* 뒤로가기 */}
        <div
          className="text-[36px] cursor-pointer"
          onClick={() => {
            navigate(-1);
          }}
        >
          <IoIosArrowRoundBack />
        </div>
        <Input
          placeholder="지금 어디로 여행을 떠나고 싶으신가요?"
          variant="borderless"
          allowClear
          onChange={e => {
            onChange();
            setInputValue(e.target.value);
          }}
          onKeyDown={e => {
            if (e.code === "Enter") {
              setSearchValue(e.target.value);
              setSearchState(true);
            }
          }}
          className={`w-full h-[60px] px-[12px] ${inputValue ? "bg-white" : "bg-slate-100"}`}
        />
        {inputValue ? null : (
          <FiSearch className="text-[24px] text-gray-400 absolute top-[50%] translate-y-[-50%] right-[45px]" />
        )}
        {searchBarFocus ? (
          <ul className="absolute top-[120%] translate-y-[-50%] left-[5px]">
            {popularData ? (
              popularData?.map((item, index) => {
                return <li key={index}>{item.strfName}</li>;
              })
            ) : (
              <li className="text-slate-700 text-[16px]">데이터 없음</li>
            )}
          </ul>
        ) : null}
      </div>
    );
  },
);

export default SearchBar;
