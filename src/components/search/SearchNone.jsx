import React, { useCallback, useEffect, useState } from "react";
import { SEARCH } from "../../constants/api";
import axios from "axios";
import { RiCloseLargeFill } from "react-icons/ri";

const SearchNone = ({ searchData }) => {
  return (
    <div className="px-[32px] flex flex-col gap-[50px]">
      {/* 인기 검색어 */}
      <div className="flex flex-col gap-[30px]">
        <h2 className="text-[24px] font-semibold text-slate-700">
          인기 검색어
        </h2>
        {/* 인기 검색어 목록 */}
        <ul className="flex gap-[20px] flex-wrap">
          {searchData?.hotKeyWords ? (
            searchData?.hotKeyWords?.map((item, index) => {
              return <li key={index}>{item}</li>;
            })
          ) : (
            <li className="text-slate-700 bg-slate-50 px-[20px] py-[10px] rounded-[20px]">
              데이터 없음
            </li>
          )}
        </ul>
      </div>
      {/* 최근 본 목록 */}
      <div className="flex flex-col gap-[30px]">
        <div className="flex justify-between items-center">
          <h2 className="text-[24px] font-semibold text-slate-700">
            최근 본 목록
          </h2>
          <button type="button" className="text-slate-400 text-[18px]">
            모두 삭제
          </button>
        </div>
        {/* 최근 본 목록 목록 */}
        <ul className="flex flex-col gap-[20px]">
          {searchData?.recentList ? (
            searchData?.recentList?.map((item, index) => {
              return (
                <li
                  key={index}
                  className="flex gap-[15px] cursor-pointer"
                  onClick={() => handleClickList(item)}
                >
                  <div className="w-[80px] h-[80px]">
                    <img
                      className="w-full h-full object-cover"
                      src={
                        item.thumbnail
                          ? item.thumbnail
                          : "/public/images/logo_icon_4.png"
                      }
                      alt="recentSearch-thumnail"
                    />
                  </div>
                  {/* 정보 */}
                  <div className="flex flex-col gap-[5px] justify-center">
                    {/* 제목 */}
                    <div className="text-[18px] text-slate-700 font-semibold">
                      {item.title}
                    </div>
                    {/* 카테고리, 지역 */}
                    <div className="flex gap-[5px]">
                      <span className="text-slate-500 text-[14px]">
                        {item.category}
                      </span>
                      <span className="text-slate-500 text-[14px]">•</span>
                      <span className="text-slate-500 text-[14px]">지역</span>
                    </div>
                  </div>
                  {/* 삭제 버튼 */}
                  <button type="button" className="text-slate-400 text-[20px]">
                    <RiCloseLargeFill />
                  </button>
                </li>
              );
            })
          ) : (
            <li className="flex cursor-pointer justify-between items-center">
              <div className="flex gap-[15px]">
                {/* 썸네일 */}
                <div className="w-[80px] h-[80px] rounded-[16px] overflow-hidden bg-slate-200">
                  {/* <img className="w-full h-full object-cover" src="#" alt="" /> */}
                </div>
                {/* 정보 */}
                <div className="flex flex-col gap-[5px] justify-center">
                  {/* 제목 */}
                  <div className="text-[18px] text-slate-700 font-semibold">
                    제목
                  </div>
                  {/* 카테고리, 지역 */}
                  <div className="flex gap-[5px]">
                    <span className="text-slate-500 text-[14px]">카테고리</span>
                    <span className="text-slate-500 text-[14px]">•</span>
                    <span className="text-slate-500 text-[14px]">지역</span>
                  </div>
                </div>
              </div>
              {/* 삭제 버튼 */}
              <button type="button" className="text-slate-400 text-[20px]">
                <RiCloseLargeFill />
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SearchNone;
