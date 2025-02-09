import React, { useEffect, useRef, useState } from "react";
import SearchItems from "./SearchItems";
import axios from "axios";
import { SEARCH } from "../../constants/api";
import { LiaComment } from "react-icons/lia";

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
  // useState
  const [selectedCate, setSelectedCate] = useState(0);
  const [dataIndex, setDataIndex] = useState(0);
  useEffect(() => {
    console.log("selectedCate", selectedCate);
    setDataIndex(0);
  }, [selectedCate]);
  useEffect(() => {
    console.log("searchData", searchData);
  }, [searchData]);

  // useRef
  const topRef = useRef(null);

  const moveTo = () => {
    // console.log(ref);
    console.log(`${topRef.current}로 이동`);
    topRef.current.scrollIntoView({ behavior: "smooth" });
  };
  // 최초 화면용 리퀘스트 데이터
  const initRequestData = {
    category: null,
    search_word: searchValue,
    last_index: null,
  };

  const tourData = Array.isArray(searchData)
    ? searchData.filter(item => item.category === "TOUR")
    : [];
  const stayData = Array.isArray(searchData)
    ? searchData.filter(item => item.category === "STAY")
    : [];
  const restaurData = Array.isArray(searchData)
    ? searchData.filter(item => item.category === "RESTAUR")
    : [];
  const festData = Array.isArray(searchData)
    ? searchData.filter(item => item.category === "FEST")
    : [];

  return (
    <div className="px-[32px] py-[30px] flex flex-col gap-[30px] min-h-screen">
      {/* 카테고리 */}
      <ul className="flex gap-[10px]" ref={topRef}>
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
      {searchData.length === 0 ? (
        <div className="flex flex-col gap-[20px] items-center py-[100px]">
          <i className="text-slate-300 text-[100px] ">
            <LiaComment />
          </i>
          <p className="text-slate-400 text-[20px]">검색 결과가 없습니다.</p>
        </div>
      ) : (
        <>
          {" "}
          {selectedCate === 0 && (
            <div>
              <SearchItems
                type={strfArr[1].type}
                name={strfArr[1].name}
                data={tourData}
                setSelectedCate={setSelectedCate}
                searchValue={searchValue}
                searchData={searchData}
                setSearchData={setSearchData}
                dataIndex={dataIndex}
                setDataIndex={setDataIndex}
                category={1}
              />
              <SearchItems
                type={strfArr[2].type}
                name={strfArr[2].name}
                data={stayData}
                setSelectedCate={setSelectedCate}
                searchValue={searchValue}
                searchData={searchData}
                setSearchData={setSearchData}
                dataIndex={dataIndex}
                setDataIndex={setDataIndex}
                category={2}
              />
              <SearchItems
                type={strfArr[3].type}
                name={strfArr[3].name}
                data={restaurData}
                setSelectedCate={setSelectedCate}
                searchValue={searchValue}
                searchData={searchData}
                setSearchData={setSearchData}
                dataIndex={dataIndex}
                setDataIndex={setDataIndex}
                category={3}
              />

              <SearchItems
                type={strfArr[4].type}
                name={strfArr[4].name}
                data={festData}
                setSelectedCate={setSelectedCate}
                searchValue={searchValue}
                searchData={searchData}
                setSearchData={setSearchData}
                dataIndex={dataIndex}
                setDataIndex={setDataIndex}
                category={4}
              />
            </div>
          )}
          {selectedCate === 1 && (
            <div>
              <SearchItems
                type="TOUR"
                data={tourData}
                searchValue={searchValue}
                searchData={searchData}
                setSearchData={setSearchData}
                dataIndex={dataIndex}
                setDataIndex={setDataIndex}
                setSelectedCate={setSelectedCate}
                category={1}
              />
            </div>
          )}
          {selectedCate === 2 && (
            <div>
              <SearchItems
                type="STAY"
                data={stayData}
                searchValue={searchValue}
                searchData={searchData}
                setSearchData={setSearchData}
                dataIndex={dataIndex}
                setDataIndex={setDataIndex}
                setSelectedCate={setSelectedCate}
                category={2}
              />
            </div>
          )}
          {selectedCate === 3 && (
            <div>
              <SearchItems
                type="RESTAUR"
                data={restaurData}
                searchValue={searchValue}
                searchData={searchData}
                setSearchData={setSearchData}
                dataIndex={dataIndex}
                setDataIndex={setDataIndex}
                setSelectedCate={setSelectedCate}
                category={3}
              />
            </div>
          )}
          {selectedCate === 4 && (
            <div>
              <SearchItems
                type="FEST"
                data={festData}
                searchValue={searchValue}
                searchData={searchData}
                setSearchData={setSearchData}
                dataIndex={dataIndex}
                setDataIndex={setDataIndex}
                setSelectedCate={setSelectedCate}
                category={4}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchList;
