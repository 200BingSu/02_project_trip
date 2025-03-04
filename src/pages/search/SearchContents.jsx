import { Input } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import SearchBar from "../../components/search/SearchBar";
import SearchNone from "../../components/search/SearchNone";
import SearchList from "../../components/search/SearchList";
import { SEARCH } from "../../constants/api";
import axios from "axios";
import jwtAxios from "../../apis/jwt";
import { getCookie } from "../../utils/cookie";
import DockBar from "../../components/layout/DockBar/DockBar";
import { searchAtom } from "../../atoms/searchAtom";
import { useRecoilState } from "recoil";

const SearchContents = () => {
  //recoil
  // const [search, setSearch] = useRecoilState(searchAtom);
  // 쿼리스트링
  const [searchParams] = useSearchParams();
  const accessToken = getCookie("accessToken");
  //useNavigate
  const navigate = useNavigate();
  // useLocation

  const location = useLocation();
  const locationState = location.state;

  // useState
  const [searchState, setSearchState] = useState(false); // 검색 전, 후 구분
  const [searchValue, setSearchValue] = useState(""); // 검색어
  const [searchData, setSearchData] = useState([]);

  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    // console.log("searchData", searchData);
  }, [searchData]);
  // 목록 클릭
  const handleClickList = item => {
    console.log(item.id);
  };
  //입력 후 데이터 호출
  const postSearchAll = async () => {
    const sendData = { search_word: searchValue, start_idx: 0 };
    console.log("검색:", sendData);
    try {
      const res = await jwtAxios.post(
        `/api/search/all?search_word=${searchValue}`,
        { ...sendData },
        // {
        //   headers: {
        //     Authorization: `Bearer ${accessToken}`,
        //   },
        // },
      );
      console.log("검색 결과 호출", res.data);
      const resultData = res.data;
      setSearchData([...resultData.data]);
    } catch (error) {
      console.log(error);
    }
  };

  // searchValue
  useEffect(() => {
    console.log("searchValue:", searchValue);
    postSearchAll();
  }, [searchValue]);

  // useEffect(() => {
  //   console.log("searchValue:", search.searchWord);
  //   postSearchAll();
  // }, [search]);

  return (
    <div className="w-full flex flex-col gap-[30px]">
      {/* 검색바 */}
      <SearchBar
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setSearchState={setSearchState}
        inputValue={inputValue}
        setInputValue={setInputValue}
        searchData={searchData}
        setSearchData={setSearchData}
      />
      {/* 검색 결과 */}
      {searchState ? (
        <SearchList
          searchValue={searchValue}
          searchData={searchData}
          setSearchData={setSearchData}
        />
      ) : (
        <SearchNone
          setSearchState={setSearchState}
          searchData={searchData}
          setSearchData={setSearchData}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
        />
      )}
      <DockBar />
    </div>
  );
};

export default SearchContents;
