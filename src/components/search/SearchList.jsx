import React, { useEffect, useRef, useState } from "react";
import SearchItems from "./SearchItems";
import axios from "axios";
import { SEARCH } from "../../constants/api";

// 카테고리 목록
/**
 * ## 카테고리 배열
 * 0: { type: "all", name: "전체" },
 * 1: { type: "TOUR", name: "관광지" },
 * 2: { type: "STAY", name: "숙소" },
 * 3: { type: "RESTAUR", name: "맛집" },
 * 4: { type: "FEST", name: "축제" },
 */
const strfArr = [
  { type: "all", name: "전체" },
  { type: "TOUR", name: "관광지" },
  { type: "STAY", name: "숙소" },
  { type: "RESTAUR", name: "맛집" },
  { type: "FEST", name: "축제" },
];
const SearchList = ({ searchValue, searchData, setSearchData }) => {
  // useRef
  // const topRef = useRef(null);
  // const stayRef = useRef(null);
  // const tourRef = useRef(null);
  // const restaurantRef = useRef(null);
  // const festivalRef = useRef(null);
  // const moveTo = ref => {
  // console.log(ref);
  //   console.log(`${ref}로 이동`);
  //   ref.current.scrollIntoView({ behavior: "smooth" });
  // };
  // useState
  const [selectedCate, setSelectedCate] = useState(0);

  // 최초 화면용 리퀘스트 데이터
  const initRequestData = {
    category: null,
    search_word: searchValue,
    last_index: null,
  };

  // getSearchList
  // const getSearchList = async data => {
  //   console.log("data:", data);
  //   try {
  //     const res = await axios.get(`${SEARCH.searchList}`, data);
  //     console.log("카테고리 검색:", res.data);
  //     setsearchData(res.data);
  //   } catch (error) {
  //     console.log("카테고리 검색:", error);
  //   }
  // };
  // useEffect(() => {
  //   getSearchList(initRequestData);
  // }, []);

  const tourData = searchData?.filter(item => item.category === "TOUR");
  const stayData = searchData?.filter(item => item.category === "STAY");
  const restaurData = searchData?.filter(item => item.category === "RESTAUR");
  const festData = searchData?.filter(item => item.category === "FEST");

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
              }}
            >
              {item.name}
            </li>
          );
        })}
      </ul>
      {/* 검색 결과 */}
      {selectedCate === 0 && (
        <div>
          <SearchItems type={strfArr[1].type} data={tourData} />
          <SearchItems type={strfArr[2].type} data={stayData} />
          <SearchItems type={strfArr[3].type} data={restaurData} />
          <SearchItems type={strfArr[4].type} data={festData} />
        </div>
      )}
      {selectedCate === 1 && (
        <div>
          <SearchItems
            type={strfArr[1].type}
            data={tourData}
            setSearchData={setSearchData}
          />
        </div>
      )}
      {selectedCate === 2 && (
        <div>
          <SearchItems
            type={strfArr[2].type}
            data={stayData}
            setSearchData={setSearchData}
          />
        </div>
      )}
      {selectedCate === 3 && (
        <div>
          <SearchItems
            type={strfArr[3].type}
            data={restaurData}
            setSearchData={setSearchData}
          />
        </div>
      )}
      {selectedCate === 4 && (
        <div>
          <SearchItems
            type={strfArr[4].type}
            data={festData}
            setSearchData={setSearchData}
          />
        </div>
      )}
    </div>
  );
};

export default SearchList;
