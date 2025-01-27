import React, { useEffect, useRef, useState } from "react";
import SearchItems from "./SearchItems";
import axios from "axios";
import { SEARCH } from "../../constants/api";

// 카테고리 목록
const strfArr = ["전체", "관광지", "숙소", "맛집", "축제"];
const SearchList = ({ searchValue, searchData }) => {
  // useRef
  const topRef = useRef(null);
  const stayRef = useRef(null);
  const tourRef = useRef(null);
  const restaurantRef = useRef(null);
  const festivalRef = useRef(null);
  const moveTo = ref => {
    // console.log(ref);
    console.log(`${ref}로 이동`);
    ref.current.scrollIntoView({ behavior: "smooth" });
  };
  // useState
  const [selectedCate, setSelectedCate] = useState(0);
  const [searchListData, setSearchListData] = useState({});

  // 최초 화면용 리퀘스트 데이터
  const initRequestData = {
    category: null,
    search_word: searchValue,
    last_index: null,
  };

  // getSearchList
  const getSearchList = async data => {
    console.log("data:", data);
    try {
      const res = await axios.get(`${SEARCH.searchList}`, data);
      console.log("카테고리 검색:", res.data);
      setSearchListData(res.data);
    } catch (error) {
      console.log("카테고리 검색:", error);
    }
  };
  useEffect(() => {
    getSearchList(initRequestData);
  }, []);

  const tourData = searchListData?.관광List;
  const stayData = searchListData?.숙소List;
  const restaurData = searchListData?.restaurList;
  const festData = searchListData?.festKust;

  return (
    <div className="px-[32px] py-[30px] flex flex-col gap-[30px]">
      {/* 카테고리 */}
      <ul className="flex gap-[10px]">
        {strfArr.map((item, index) => {
          return (
            <li
              key={index}
              className={`cursor-pointer font-semibold text-[16px] w-[124px] flex justify-center items-center px-[15px] py-[10px] gap-[10px] rounded-[8px] ${index === selectedCate ? "bg-primary text-white" : "bg-white text-slate-500"}`}
              onClick={() => {
                setSelectedCate(index);
                if (index === 0) {
                  moveTo(tourRef);
                } else if (index === 1) {
                  moveTo(tourRef);
                } else if (index === 2) {
                  moveTo(stayRef);
                } else if (index === 3) {
                  moveTo(restaurantRef);
                } else if (index === 4) {
                  moveTo(festivalRef);
                }
              }}
            >
              {item}
            </li>
          );
        })}
      </ul>
      {/* 검색 결과 */}
      <SearchItems
        type="관광지"
        data={tourData}
        ref={tourRef}
        searchValue={searchValue}
      />
      <SearchItems
        type="숙소"
        data={stayData}
        ref={stayRef}
        searchValue={searchValue}
      />
      <SearchItems
        type="맛집"
        data={restaurData}
        ref={restaurantRef}
        searchValue={searchValue}
      />
      <SearchItems
        type="축제"
        data={festData}
        ref={festivalRef}
        searchValue={searchValue}
      />
    </div>
  );
};

export default SearchList;
