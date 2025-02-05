import { Input } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import SearchBar from "../../components/search/SearchBar";
import SearchNone from "../../components/search/SearchNone";
import SearchList from "../../components/search/SearchList";
import { SEARCH } from "../../constants/api";
import axios from "axios";
import jwtAxios from "../../apis/jwt";
import { getCookie } from "../../utils/cookie";

const SearchContents = () => {
  // 쿼리스트링
  const [searchParams] = useSearchParams();
  const accessToken = getCookie("accessToken");
  //useNavigate
  const navigate = useNavigate();
  // useState
  const [searchState, setSearchState] = useState(false); // 검색 전, 후 구분
  const [searchValue, setSearchValue] = useState(""); // 검색어
  const [searchData, setSearchData] = useState({});
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    console.log("searchData", searchData);
  }, [searchData]);
  // 목록 클릭
  const handleClickList = item => {
    console.log(item.id);
  };
  //입력 후 데이터 호출
  const postSearchAll = async () => {
    const sendData = { search_word: searchValue };
    try {
      const res = await axios.post(
        `/api/search/all?search_word=${searchValue}`,
        sendData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const resultData = res.data;
      setSearchData(resultData.data);
    } catch (error) {
      console.log(error);
    }
  };
  // searchValue
  useEffect(() => {
    console.log("searchValue:", searchValue);
    postSearchAll();
  }, [searchValue]);

  return (
    <div className="w-full flex flex-col gap-[30px]">
      {/* 검색바 */}
      <SearchBar
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setSearchState={setSearchState}
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
      {/* 검색 결과 */}
      {searchState ? (
        <SearchList
          searchData={searchData}
          searchValue={searchValue}
          setSearchData={setSearchData}
        />
      ) : (
        <SearchNone searchData={searchData} setSearchValue={setSearchValue} />
      )}
    </div>
  );
};

export default SearchContents;
