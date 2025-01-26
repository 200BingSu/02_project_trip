import { Input } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import SearchBar from "../../components/search/SearchBar";
import SearchNone from "../../components/search/SearchNone";
import SearchList from "../../components/search/SearchList";
import { SEARCH } from "../../constants/api";
import axios from "axios";

const SearchContents = () => {
  //useNavigate
  const navigate = useNavigate();
  // useState
  const [searchState, setSearchState] = useState(false); // 검색 전, 후 구분
  const [searchValue, setSearchValue] = useState(""); // 검색어
  const [searchData, setSearchData] = useState({});
  // search api
  const getSearch = useCallback(async () => {
    try {
      const res = await axios.get(`${SEARCH.search}`);
      console.log("검색:", res.data);
      setSearchData(res.data);
    } catch (error) {
      console.log("검색:", error);
    }
  }, []);
  useEffect(() => {
    getSearch();
  }, []);
  // searchValue
  useEffect(() => {
    console.log("searchValue:", searchValue);
  }, [searchValue]);

  // 목록 클릭
  const handleClickList = item => {
    console.log(item.id);
  };
  // 최근 검색어
  const searchedTxts = searchData?.searchedTxts;

  return (
    <div className="w-full">
      {/* 상단바 */}
      <div className=" flex px-[32px] py-[30px] gap-[40px] items-center bg-white">
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
        <SearchBar
          searchState={searchState}
          setSearchState={setSearchState}
          searchedTxts={searchedTxts}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </div>
      {/* 검색 결과 */}
      {searchState ? (
        <SearchList searchData={searchData} searchValue={searchValue} />
      ) : (
        <SearchNone searchData={searchData} />
      )}
    </div>
  );
};

export default SearchContents;
