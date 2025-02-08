import React, { useCallback, useEffect, useState } from "react";
import { SEARCH } from "../../constants/api";
import axios from "axios";
import { RiCloseLargeFill } from "react-icons/ri";
import { getCookie } from "../../utils/cookie";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../atoms/userAtom";

import { ProductPic } from "../../constants/pic";

import { useNavigate } from "react-router-dom";
import { categoryKor } from "../../utils/match";

const SearchNone = ({
  searchData,
  setSearchData,
  setSearchValue,
  searchValue,
  setSearchState,
}) => {
  const accessToken = getCookie("accessToken");
  // recoil
  const { userId } = useRecoilValue(userAtom);
  const [popularData, setPopularData] = useState([]);
  const [recentContents, setRecentContents] = useState([]);

  //useNavigate
  const navigate = useNavigate();

  // 인기 검색어
  const getSearchBasicPopular = async () => {
    try {
      const res = await axios.get(
        `/api/search/popular`,
        //   {
        //   headers: {
        //     Authorization: `Bearer ${accessToken}`,
        //   },
        // }
      );
      const resultData = res.data;
      // console.log("인기검색어 결과", resultData);
      setPopularData(resultData.data);
    } catch (error) {
      console.log("인기검색어 결과", error);
    }
  };
  useEffect(() => {
    // console.log("인기 검색어", popularData);
  }, [popularData]);
  // 최근 검색 목록
  const getBasicList = async () => {
    try {
      const res = await axios.get(`/api/search/basic?user_id=${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const resultData = res.data;
      // console.log("최근 본 검색 결과", resultData);
      setRecentContents(resultData.data);
    } catch (error) {
      console.log("최근 본 검색 결과", error);
    }
  };
  useEffect(() => {
    // console.log("최근 본 검색 목록", recentContents);
  }, [recentContents]);
  const handleClickWord = word => {
    console.log("클릭한 인기 검색어:", word);
    setSearchValue(word.strfName);
    navigate(`/contents/index?strfId=${word.strfId}`);
  };

  const handleClickList = item => {
    console.log(item);
    navigate(`/contents/index?strfId=${item.strfId}`);
  };
  //검색어 클릭
  const postSearchAll = async () => {
    const sendData = { search_word: searchValue };
    try {
      const res = await axios.post(
        `/api/search/all?search_word=${searchValue}`,
        { ...sendData },
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
  // 최근 본 목록 개별 삭제
  const patchRecentList = async item => {
    const sendData = { strf_id: item.strfId };
    try {
      const res = await axios.patch(
        `/api/recent/hide?strf_id=${item.strfId}`,
        { ...sendData },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(res.data);
      if (res.data) {
        getBasicList();
      }
    } catch (error) {
      console.log("개별 삭제", error);
    }
  };
  const patchRecentListAll = async () => {
    try {
      const res = await axios.patch(
        `/api/recent/hide/all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(res.data);
      if (res.data) {
        getBasicList();
      }
    } catch (error) {
      console.log("개별 삭제", error);
    }
  };
  useEffect(() => {
    getSearchBasicPopular();
    if (accessToken) {
      getBasicList();
    }
  }, []);
  return (
    <div className="px-[32px] flex flex-col gap-[50px]">
      {/* 인기 검색어 */}
      <div className="flex flex-col gap-[30px]">
        <h2 className="text-[24px] font-semibold text-slate-700">
          인기 검색어
        </h2>
        {/* 인기 검색어 목록 */}
        <ul className="flex gap-[20px] flex-wrap">
          {popularData ? (
            popularData?.map((item, index) => {
              return (
                <li
                  key={index}
                  className="cursor-pointer text-slate-700 bg-slate-50 px-[20px] py-[10px] rounded-[20px]"
                  onClick={() => handleClickWord(item)}
                >
                  {item.strfName}
                </li>
              );
            })
          ) : (
            <li className="text-slate-700 bg-slate-50 px-[20px] py-[10px] rounded-[20px]">
              데이터 없음
            </li>
          )}
        </ul>
      </div>
      {/* 최근 본 목록 */}
      {accessToken ? (
        <div className="flex flex-col gap-[30px]">
          <div className="flex justify-between items-center">
            <h2 className="text-[24px] font-semibold text-slate-700">
              최근 본 목록
            </h2>
            <button
              type="button"
              className="text-slate-400 text-[18px]"
              onClick={() => patchRecentListAll()}
            >
              모두 삭제
            </button>
          </div>
          {/* 최근 본 목록 목록 */}
          <ul className="flex flex-col gap-[20px]">
            {recentContents
              ? recentContents?.map((item, index) => {
                  return (
                    <li
                      key={index}
                      className="flex cursor-pointer items-center justify-between"
                    >
                      <div
                        className="flex gap-[15px]"
                        onClick={() => handleClickList(item)}
                      >
                        <div className="w-[80px] h-[80px] rounded-2xl overflow-hidden">
                          <img
                            className="w-full h-full object-cover"
                            src={
                              item.strfPic
                                ? `${ProductPic}${item.strfId}/${item.strfPic}`
                                : "/public/images/logo_icon_4.png"
                            }
                            alt={item.strfName}
                          />
                        </div>
                        {/* 정보 */}
                        <div className="flex flex-col gap-[5px] justify-center">
                          {/* 제목 */}
                          <div className="text-[18px] text-slate-700 font-semibold">
                            {item.strfName}
                          </div>
                          {/* 카테고리, 지역 */}
                          <div className="flex gap-[5px]">
                            <span className="text-slate-500 text-[14px]">
                              {categoryKor(item.category)}
                            </span>
                            <span className="text-slate-500 text-[14px]">
                              •
                            </span>
                            <span className="text-slate-500 text-[14px]">
                              {item.locationTitle}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 삭제 버튼 */}
                      <button
                        type="button"
                        className="text-slate-400 text-[20px]"
                        onClick={() => patchRecentList(item)}
                      >
                        <RiCloseLargeFill />
                      </button>
                    </li>
                  );
                })
              : null}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default SearchNone;
