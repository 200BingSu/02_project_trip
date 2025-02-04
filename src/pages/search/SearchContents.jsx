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

const SearchContents = () => {
  // 쿼리스트링
  const [searchParams] = useSearchParams();

  //useNavigate
  const navigate = useNavigate();
  // useState
  const [searchState, setSearchState] = useState(false); // 검색 전, 후 구분
  const [searchValue, setSearchValue] = useState(""); // 검색어
  const [searchData, setSearchData] = useState({});
  const [popularData, setPopularData] = useState([]);
  // search api
  const getSearch = useCallback(async () => {
    try {
      const res = await jwtAxios.get(`${SEARCH.search}`);
      console.log("검색:", res.data);
      setSearchData(res.data);
    } catch (error) {
      console.log("검색:", error);
    }
  }, []);
  useEffect(() => {
    getSearch();
  }, []);
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
    <div className="w-full flex flex-col gap-[30px]">
      {/* 검색바 */}
      <SearchBar
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setSearchState={setSearchState}
      />
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
