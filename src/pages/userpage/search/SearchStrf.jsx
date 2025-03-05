import {
  Button,
  Checkbox,
  FloatButton,
  Form,
  Input,
  Modal,
  Select,
} from "antd";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { VscSettings } from "react-icons/vsc";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowRoundBack, IoIosArrowUp } from "react-icons/io";
import { RiCloseLargeFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import jwtAxios from "../../../apis/jwt";
import { searchAtom } from "../../../atoms/searchAtom";
import { userAtom } from "../../../atoms/userAtom";
import CenterModal from "../../../components/common/CenterModal";
import { ProductPic } from "../../../constants/pic";
import { getCookie } from "../../../utils/cookie";
import { categoryKor } from "../../../utils/match";
import SearchCategoryList from "../../../components/search/SearchCategoryList";
import { LiaComment } from "react-icons/lia";
import PulseLoader from "react-spinners/PulseLoader";
import { amenities, strfArr } from "../../../constants/dataArr";
import { moveTo } from "../../../utils/moveTo";
import { categoryArr, orderTypeArr } from "../../../constants/search";

import AmenityFilter from "../../../components/search/AmenityFilter";
import { resetSearchData } from "../../../selectors/searchSelector";
import { Swiper, SwiperSlide } from "swiper/react";

const SearchStrf = () => {
  const [form] = Form.useForm();
  //recoil
  const [searchRecoil, setSearchRecoil] = useRecoilState(searchAtom);
  const resetSearch = useResetRecoilState(resetSearchData);
  useEffect(() => {
    console.log("searchRecoil", searchRecoil);
  }, [searchRecoil]);
  //쿠키
  const accessToken = getCookie("accessToken");
  const userId = getCookie("user")?.userId;
  //useRef
  const topRef = useRef(null);
  const swiperRef = useRef(null);
  //useNavigate
  const navigate = useNavigate();
  const navigateToBack = () => {
    navigate(-1);
    resetSearch();
  };
  //useState
  const [searchState, setSearchState] = useState(
    searchRecoil.searchWord !== "" ? true : false,
  );
  const [popularWordList, setPopularWordList] = useState([]); // 인기 검색어
  const [recentContents, setRecentContents] = useState([]); // 최근 본 목록
  const [recentText, setRecentText] = useState([]); // 최근 검색어
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [isSearchLoading, setIsSearchLoading] = useState(false); // 검색 로딩
  const [isAmenityOpen, setIsAmenityOpen] = useState(false); // 편의시설 열림 상태
  const [searchCount, setSearchCount] = useState(0); // 검색 총 수

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
    try {
      const res = await jwtAxios.get(`/api/search/list`);
      const resultData = res.data;
      // console.log(resultData);
      const filterArr = resultData.data.filter(item => {
        return item.txt !== "";
      });
      setRecentText(filterArr);
    } catch (error) {
      console.log("최근 검색어 호출 결과:", error);
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
  // api 전체 검색
  const postSearchAll = useCallback(async word => {
    if (accessToken) {
      try {
        const res = await jwtAxios.get(`/api/search/all?search_word=${word}`);
        const resultData = res.data;
        if (resultData) {
          setIsSearchLoading(true);
          setSearchState(true);
        }
        setSearchRecoil(prev => ({
          ...prev,
          searchData: resultData.data,
          start_idx: 0,
          category: 0,
          amenityId: [],
          orderType: 0,
          more: true,
        }));
      } catch (error) {
        console.log("전체 검색", error);
      }
    } else {
      try {
        const res = await axios.get(`/api/search/all?search_word=${word}`);
        // console.log(res.data);
        const resultData = res.data;
        if (resultData) {
          setIsSearchLoading(true);
          setSearchState(true);
        }
        setSearchRecoil(prev => ({
          ...prev,
          searchData: resultData.data,
        }));
      } catch (error) {
        console.log("전체 검색", error);
      }
    }
  }, []);
  // api 카테고리 검색
  const getCategorySearch = useCallback(async () => {
    try {
      const res = await axios.get(
        `/api/search/category?start_idx=${searchRecoil.start_idx}&category=${
          categoryArr[searchRecoil.category].name
        }&search_word=${searchRecoil.searchWord}&order_type=${searchRecoil.orderType}`,
      );
      const resultData = res.data;
      if (resultData) {
        setIsSearchLoading(true);
      }

      if (resultData.data && resultData.data.length >= 10) {
        setSearchRecoil(prev => ({
          ...prev,
          searchData:
            searchRecoil.start_idx === 0
              ? resultData.data
              : [...prev.searchData, ...resultData.data],
          start_idx: searchRecoil.start_idx + 10,
          more: resultData.data[0]?.more,
        }));
      } else {
        setSearchRecoil(prev => ({
          ...prev,
          searchData:
            searchRecoil.start_idx === 0
              ? resultData.data
              : [...prev.searchData, ...resultData.data],
          start_idx: searchRecoil.start_idx + resultData.data.length + 1,
          more: false,
        }));
      }
    } catch (error) {
      console.log("카테고리 검색", error);
    }
  }, [
    searchRecoil.category,
    searchRecoil.start_idx,
    searchRecoil.searchWord,
    searchRecoil.orderType,
  ]);
  // api 검색 총 수
  const getSearchCount = useCallback(async () => {
    try {
      const res = await axios.get(
        `/api/search/count?category=${categoryArr[searchRecoil.category].name}&search_word=${searchRecoil.searchWord}`,
      );
      console.log("검색 총 수", res.data);
      setSearchRecoil(prev => ({ ...prev, count: res.data.data }));
    } catch (error) {
      console.log("검색 총 수", error);
    }
  }, [searchRecoil.category, searchRecoil.searchWord]);
  // api 편의필터 검색 총 수
  const getAmenitySearchCount = useCallback(async () => {
    const amenityIds = searchRecoil.amenityId
      .map(item => `amenity_id=${item.amenity_id}`)
      .join("&");
    try {
      const res = await axios.get(
        `/api/search/count?category=${categoryArr[searchRecoil.category].name}&search_word=${searchRecoil.searchWord}&${amenityIds}`,
      );
      console.log("편의필터 검색 총 수", res.data);
      setSearchRecoil(prev => ({ ...prev, count: res.data.data }));
    } catch (error) {
      console.log("편의필터 검색 총 수", error);
    }
  }, [searchRecoil.amenityId, searchRecoil.searchWord]);
  useEffect(() => {
    getSearchCount();
  }, [searchRecoil.category, searchRecoil.searchWord]);
  // 카테고리 별 데이터
  const tourData = searchRecoil.searchData?.filter(
    item => item.category === "TOUR",
  );
  const stayData = searchRecoil.searchData?.filter(
    item => item.category === "STAY",
  );
  const restaurData = searchRecoil.searchData?.filter(
    item => item.category === "RESTAUR",
  );
  const festData = searchRecoil.searchData?.filter(
    item => item.category === "FEST",
  );
  // 검색창 비우기
  const onChange = e => {
    setSearchRecoil(prev => ({ ...prev, searchWord: e.target.value }));
  };
  // 최근 검색어 클릭
  const handleClickRecentText = useCallback(word => {
    console.log("클릭한 최근 검색어:", word);
    setSearchRecoil(prev => ({ ...prev, searchWord: word.txt }));
    postSearchAll(word.txt);
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
  const handleClickClear = useCallback(() => {
    setSearchRecoil(prev => ({ ...prev, searchWord: "" }));
  }, []);
  //모달 취소
  const handleClickCancle = () => {
    setIsModalOpen(false);
  };
  // 검색 엔터
  const handleClickEnter = e => {
    if (!searchRecoil.searchWord.trim()) return; // 빈 검색어 체크
    setIsSearchLoading(false); // 로딩 상태 초기화
    postSearchAll(e.target.value);
    setSearchState(true);
  };
  // 전체보기에서 더보기 클릭
  const handleClickAllMore = cateNum => {
    moveTo(topRef);
    setSelectedCategory(cateNum);
    setSearchRecoil(prev => ({ ...prev, category: cateNum }));
  };
  // 카테고리 선택
  const handleChangeCategory = index => {
    setSearchRecoil(prev => ({
      ...prev,
      start_idx: 0,
      category: index,
      orderType: 0,
    }));
    // 해당 슬라이드로 이동
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
  };
  // 카테고리 검색 내 더보기
  const handleClickMore = () => {
    getCategorySearch();
  };
  // 편의시설 필터 모달
  const showAmenityFilter = () => {
    setIsAmenityOpen(true);
  };

  //useEffect
  useEffect(() => {
    getPopularWord();
    if (accessToken) {
      getBasicList();
      getRecentText();
    }
  }, []);
  useEffect(() => {
    setSearchRecoil(prev => ({
      ...prev,
      searchData: [],
      start_idx: 0,
      more: true,
    }));
    setIsSearchLoading(false);

    if (searchRecoil.searchWord.trim()) {
      const timer = setTimeout(() => {
        if (searchRecoil.category !== 0) {
          getCategorySearch();
        } else {
          postSearchAll(searchRecoil.searchWord);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [searchRecoil.category, searchRecoil.orderType]);

  // Update orderType handler
  const handleOrderTypeChange = value => {
    setSearchRecoil(prev => ({
      ...prev,
      orderType: value,
      start_idx: 0,
    }));
  };

  return (
    <div className="w-full flex flex-col  mb-[100px]">
      {/* 상단 */}
      <div
        className="w-full px-4 py-6 flex items-center gap-3 relative"
        ref={topRef}
      >
        {/* 뒤로가기 */}
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
            suffix={<FiSearch className="text-slate-400 text-2xl" />}
            onChange={onChange}
            onPressEnter={e => {
              if (e.target.value.trim()) {
                handleClickEnter(e);
              }
            }}
            variant="filled"
            value={searchRecoil.searchWord}
            className="max-h-[60px] h-[16vw] text-lg rounded-lg gap-[5px]
            bg-slate-50 hover:bg-slate-100 placeholder:text-slate-400 "
          />
        </label>
      </div>

      {/* 카테고리와 검색 결과 */}
      {searchState ? (
        <div className="px-[32px] py-[30px] flex flex-col min-h-screen">
          {/* 카테고리 */}
          <div className="py-4">
            <Swiper
              ref={swiperRef}
              slidesPerView={4.5}
              spaceBetween={6}
              initialSlide={searchRecoil.category}
            >
              {categoryArr.map((item, index) => {
                return (
                  <SwiperSlide
                    key={index}
                    className={`cursor-pointer text-sm w-full flex justify-center items-center py-2 gap-[10px] rounded-xl ${
                      index === searchRecoil.category
                        ? "bg-primary text-white"
                        : "bg-white text-slate-500"
                    }`}
                    onClick={() => {
                      handleChangeCategory(index);
                    }}
                  >
                    <p className="text-center"> {item.name}</p>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
          <div className="h-[2.66vw] max-h-[10px] bg-slate-100"></div>
          {/* 총 개수, 정렬 방식 */}
          <div className="flex items-center gap-3 justify-between py-4">
            <div className="text-xs text-slate-700 font-semibold">
              {searchRecoil.category === 0
                ? null
                : `총 ${searchRecoil.count}개`}
            </div>
            <div className="flex items-center gap-3">
              {searchRecoil.category !== 0 && (
                <Select
                  value={searchRecoil.orderType}
                  onChange={handleOrderTypeChange}
                  options={orderTypeArr.map((item, index) => ({
                    value: index,
                    label: (
                      <span className="text-slate-500 text-xs">
                        {item.name}
                      </span>
                    ),
                  }))}
                  style={{ color: "#64748b" }}
                  className="h-[4.53vw] max-h-[17px]"
                  variant="borderless"
                />
              )}
              <div>
                {searchRecoil.category === 2 && (
                  <Button
                    onClick={showAmenityFilter}
                    type="button"
                    className="text-xs text-slate-500"
                  >
                    필터 <VscSettings />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* 검색 결과 */}
          {isSearchLoading ? (
            searchRecoil.searchData?.length === 0 ? (
              <div className="flex flex-col gap-[20px] items-center py-[100px]">
                <i className="text-slate-300 text-[100px]">
                  <LiaComment />
                </i>
                <p className="text-slate-400 text-[20px]">
                  검색 결과가 없습니다.
                </p>
              </div>
            ) : (
              <>
                {searchRecoil.category === 0 && (
                  <div className="flex flex-col gap-[30px]">
                    <SearchCategoryList
                      title={categoryArr[1].name}
                      categoryData={tourData}
                      searchValue={searchRecoil.searchWord}
                      buttonClick={() => {
                        handleClickAllMore(1);
                      }}
                    />
                    <SearchCategoryList
                      title={categoryArr[2].name}
                      categoryData={stayData}
                      searchValue={searchRecoil.searchWord}
                      buttonClick={() => {
                        handleClickAllMore(2);
                      }}
                    />
                    <SearchCategoryList
                      title={categoryArr[3].name}
                      categoryData={restaurData}
                      searchValue={searchRecoil.searchWord}
                      buttonClick={() => {
                        handleClickAllMore(3);
                      }}
                    />
                    <SearchCategoryList
                      title={categoryArr[4].name}
                      categoryData={festData}
                      searchValue={searchRecoil.searchWord}
                      buttonClick={() => {
                        handleClickAllMore(4);
                      }}
                    />
                  </div>
                )}
                {searchRecoil.category === 1 && (
                  <SearchCategoryList
                    title={categoryArr[1].name}
                    categoryData={searchRecoil.searchData}
                    searchValue={searchRecoil.searchWord}
                    buttonClick={handleClickMore}
                  />
                )}
                {searchRecoil.category === 2 && (
                  <SearchCategoryList
                    title={categoryArr[2].name}
                    categoryData={searchRecoil.searchData}
                    searchValue={searchRecoil.searchWord}
                    buttonClick={handleClickMore}
                  />
                )}
                {searchRecoil.category === 3 && (
                  <SearchCategoryList
                    title={categoryArr[3].name}
                    categoryData={searchRecoil.searchData}
                    searchValue={searchRecoil.searchWord}
                    buttonClick={handleClickMore}
                  />
                )}
                {searchRecoil.category === 4 && (
                  <SearchCategoryList
                    title={categoryArr[4].name}
                    categoryData={searchRecoil.searchData}
                    searchValue={searchRecoil.searchWord}
                    buttonClick={handleClickMore}
                  />
                )}
              </>
            )
          ) : (
            <div className="flex justify-center items-center h-[50vh]">
              <PulseLoader color="#0DD1FD" speedMultiplier={0.8} />
            </div>
          )}
        </div>
      ) : (
        /* 검색 전 화면 */
        <div className="flex flex-col gap-8 px-4">
          {/* 최근 검색어 */}
          {accessToken && (
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-slate-700 select-none">
                최근 검색어
              </h2>
              {/* 최근 검색어 목록 */}
              <ul className="flex gap-3 flex-wrap">
                {recentText ? (
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
            <ul className="flex flex-col gap-[20px] flex-wrap h-[40vw] max-h-[250px]">
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
              <div className="w-full select-none">
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
              </div>
            </div>
          )}
        </div>
      )}

      {/* 모달 */}
      {isModalOpen && (
        <CenterModal
          handleClickCancle={handleClickCancle}
          handleClickSubmit={patchRecentListAll}
          content="최근 본 목록을 모두 삭제하시겠습니까?"
        />
      )}
      {isAmenityOpen && <AmenityFilter setIsAmenityOpen={setIsAmenityOpen} />}
    </div>
  );
};

export default SearchStrf;
