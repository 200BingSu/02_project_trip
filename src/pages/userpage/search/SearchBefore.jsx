import React, { useCallback, useEffect, useRef, useState } from "react";
import { getCookie } from "../../../utils/cookie";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import jwtAxios from "../../../apis/jwt";
import axios from "axios";
import { Input } from "antd";
import { FiSearch } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductPic } from "../../../constants/pic";
import { categoryKor } from "../../../utils/match";

const SearchBefore = () => {
  //쿠키
  const accessToken = getCookie("accessToken");
  //useNavigate
  const navigate = useNavigate();
  const navigateToBack = () => {
    navigate("/");
  };
  const niviagateToAfter = () => {
    navigate(
      `/search/strf?keyword=${keyword}&category=0&orderType=0&filter=none`,
    );
  };
  //useState
  const [keyword, setKeyword] = useState("");
  const [popularWordList, setPopularWordList] = useState([]); // 인기 검색어
  const [recentContents, setRecentContents] = useState([]); // 최근 본 목록
  const [recentText, setRecentText] = useState([]); // 최근 검색어
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [isLoading, setIsLoading] = useState(false);
  //useRef
  const topRef = useRef(null);
  // api 인기 검색어
  const getPopularWord = useCallback(async () => {
    const apiUrl = "/api/search/popular";
    try {
      const res = await axios.get(apiUrl);
      // console.log("인기검색어", res.data);
      setPopularWordList(res.data.data);
    } catch (error) {
      console.log("인기 검색어", error);
    }
  }, []);
  // api 최근 본 목록
  const getBasicList = useCallback(async () => {
    try {
      const res = await jwtAxios.get(`/api/search/basic`);
      const resultData = res.data;
      // console.log("최근 본 검색 결과", resultData);
      setRecentContents(resultData.data);
    } catch (error) {
      console.log("최근 본 검색 결과", error);
    }
  }, []);
  // api 최근 검색어
  const getRecentText = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await jwtAxios.get(`/api/search/list`);
      const resultData = res.data;
      // console.log(resultData);
      const filterArr = resultData.data.filter(item => {
        return item.txt !== "";
      });
      setRecentText(filterArr);
      setIsLoading(false);
    } catch (error) {
      console.log("최근 검색어 호출 결과:", error);
      setIsLoading(false);
    }
  }, []);
  // api 최근 본 목록 개별 삭제
  const patchRecentList = useCallback(async item => {
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
  }, []);
  // api 최근 본 목록 전체 삭제
  const patchRecentListAll = useCallback(async () => {
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
        setIsModalOpen(false);
      }
    } catch (error) {
      console.log("개별 삭제", error);
    }
  }, []);

  // 최근 검색어 클릭
  const handleClickRecentText = useCallback(word => {
    console.log("클릭한 최근 검색어:", word);
    navigate(
      `/search/strf?keyword=${word.txt}&category=0&orderType=0&filter=none`,
    );
  }, []);
  // 인기 검색어 클릭
  const handleClickPopularWord = useCallback(word => {
    console.log("클릭한 인기 검색어:", word);
    // setSearchValue(word.strfName);
    navigate(`/contents/index?strfId=${word.strfId}`);
  }, []);
  // 최근 본 목록 클릭
  const handleClickList = useCallback(item => {
    console.log("클릭한 최근 본 목록:", item);
    navigate(`/contents/index?strfId=${item.strfId}`);
  }, []);
  // 검색창 비우기
  const handleClickClear = useCallback(() => {}, []);

  //모달 취소
  const handleClickCancle = () => {
    setIsModalOpen(false);
  };
  // 검색 엔터
  const handleClickEnter = () => {
    niviagateToAfter();
  };
  //useEffect
  useEffect(() => {
    getPopularWord();
    if (accessToken) {
      getBasicList();
      getRecentText();
    }
  }, []);
  return (
    <div className="w-full flex flex-col  mb-[100px]">
      <section
        className="w-full px-4 py-6 flex items-center gap-3 relative"
        ref={topRef}
      >
        <div
          className="text-3xl cursor-pointer"
          onClick={() => {
            navigateToBack();
          }}
        >
          <IoIosArrowRoundBack />
        </div>
        {/* 검색바 */}
        <label htmlFor="searchBar" className="relative w-full">
          <Input
            id="searchBar"
            placeholder="관광지, 장소, 숙소,맛집을 검색해 보세요"
            allowClear
            onClear={handleClickClear}
            suffix={
              <button type="button" onClick={handleClickEnter}>
                <FiSearch className="text-slate-400 text-2xl" />
              </button>
            }
            onChange={e => setKeyword(e)}
            onPressEnter={e => {
              if (e.target.value.trim()) {
                handleClickEnter();
              }
            }}
            variant="filled"
            // value={searchRecoil.searchWord}
            className="max-h-[60px] h-[16vw] text-lg rounded-lg gap-[5px]
            bg-slate-50 hover:bg-slate-100 placeholder:text-slate-400 "
          />
        </label>
      </section>
      <section className="flex flex-col gap-8 px-4">
        {/* 최근 검색어 */}
        {accessToken && (
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-slate-700 select-none">
              최근 검색어
            </h2>
            {/* 최근 검색어 목록 */}
            <ul className="flex gap-3 flex-wrap">
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <li className="text-transparent bg-slate-50 px-4 py-[6px] rounded-[20px] text-sm select-none">
                    제주
                  </li>
                  <li className="text-transparent bg-slate-50 px-4 py-[6px] rounded-[20px] text-sm select-none">
                    제주
                  </li>
                  <li className="text-transparent bg-slate-50 px-4 py-[6px] rounded-[20px] text-sm select-none">
                    제주
                  </li>
                  <li className="text-transparent bg-slate-50 px-4 py-[6px] rounded-[20px] text-sm select-none">
                    제주
                  </li>
                  <li className="text-transparent bg-slate-50 px-4 py-[6px] rounded-[20px] text-sm select-none">
                    제주
                  </li>
                </div>
              ) : recentText ? (
                recentText?.map((item, index) => {
                  return (
                    <li
                      key={index}
                      className="cursor-pointer text-slate-700 bg-slate-50 px-4 py-[6px] rounded-[20px] text-sm select-none"
                      onClick={() => handleClickRecentText(item)}
                    >
                      {item.txt}
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
        )}

        {/* 인기 검색어 */}
        <div className="flex flex-col gap-[30px]">
          <h2 className="text-lg  font-semibold text-slate-700 select-none">
            인기 검색어
          </h2>
          {/* 인기 검색어 목록 */}
          <ul className="flex flex-col gap-[20px] flex-wrap h-[40vw] max-h-[230px]">
            {popularWordList ? (
              popularWordList?.map((item, index) => {
                return (
                  <li
                    key={index}
                    className="cursor-pointer "
                    onClick={() => handleClickPopularWord(item)}
                  >
                    <p className="flex gap-3 items-center select-none">
                      <span className="text-slate-700 text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-slate-700 text-sm">
                        {item.strfName}
                      </span>
                    </p>
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
        {accessToken && (
          <div className="flex flex-col gap-[30px]">
            <div className="flex justify-between items-center">
              <h2 className="text-lg  font-semibold text-slate-700 select-none">
                최근 본 상품
              </h2>
              <button
                type="button"
                className="text-slate-400 text-[18px] select-none"
                onClick={() => setIsModalOpen(true)}
              >
                모두 삭제
              </button>
            </div>
            {/* 최근 본 목록 목록 */}
            <div className="w-full select-none px-4">
              {recentContents && recentContents.length > 0 && (
                <Swiper
                  slidesPerView={2.5}
                  spaceBetween={12}
                  direction={"horizontal"}
                  className="w-full flex select-none"
                >
                  {recentContents
                    ? recentContents?.map((item, index) => {
                        return (
                          <SwiperSlide
                            key={index}
                            className="w-auto !h-auto shrink-0 select-none"
                            onClick={() => handleClickList(item)}
                          >
                            <div className="flex flex-col gap-[15px] w-full select-none">
                              <div className="aspect-square w-full rounded-2xl overflow-hidden">
                                <img
                                  className="w-full h-full object-cover"
                                  src={
                                    item.strfPic
                                      ? `${ProductPic}/${item.strfId}/${item.strfPic}`
                                      : "/images/logo_icon_4.png"
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
                                  <span className="text-slate-500 text-sm">
                                    {categoryKor(item.category)}
                                  </span>
                                  <span className="text-slate-500 text-sm">
                                    •
                                  </span>
                                  <span className="text-slate-500 text-sm">
                                    {item.locationTitle}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </SwiperSlide>
                        );
                      })
                    : null}
                </Swiper>
              )}
            </div>
          </div>
        )}
      </section>
      {/* 모달 */}
      {isModalOpen && (
        <CenterModal
          handleClickCancle={handleClickCancle}
          handleClickSubmit={patchRecentListAll}
          content="최근 본 목록을 모두 삭제하시겠습니까?"
        />
      )}
    </div>
  );
};

export default SearchBefore;
