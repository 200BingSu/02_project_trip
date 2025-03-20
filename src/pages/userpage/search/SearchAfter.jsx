import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { searchAtom } from "../../../atoms/searchAtom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { Button, Input, Select, Spin } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { categoryArr, orderTypeArr } from "../../../constants/search";
import { VscSettings } from "react-icons/vsc";
import AmenityFilter from "../../../components/search/AmenityFilter";
import NoData from "../../../components/common/NoData";
import SearchItem from "../../../components/search/SearchItem";
import { getCookie } from "../../../utils/cookie";
import axios from "axios";
import SearchCategoryList from "../../../components/search/SearchCategoryList";
import SearchAll from "../../../components/search/SearchAll";
const SearchAfter = () => {
  //쿠키
  const accessToken = getCookie("accessToken");
  // 쿼리
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const category = Number(searchParams.get("category"));
  const orderType = Number(searchParams.get("orderType"));
  const filter = searchParams.get("filter");

  //useNavigate
  const navigate = useNavigate();
  const navigateToBack = () => {
    navigate(-1);
    resetSearch();
  };
  // recoil
  const [searchRecoil, setSearchRecoil] = useRecoilState(searchAtom);

  const resetSearch = useResetRecoilState(searchAtom);
  const searchValue = useRecoilValue(searchAtom);
  //useRef
  const topRef = useRef(null);
  const swiperRef = useRef(null);
  // useState
  const [isAmenityOpen, setIsAmenityOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // 검색창 비우기
  const handleClickClear = useCallback(() => {}, []);

  // api 전체 검색
  const postSearchAll = useCallback(async word => {
    const url = `/api/search/all?search_word=${word}`;
    setIsLoading(true);
    if (accessToken) {
      try {
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const resultData = res.data;
        if (resultData) {
          setIsLoading(false);
        }
        setSearchRecoil(prev => ({
          ...prev,
          searchData: resultData.data,
          start_idx: 0,
          category: 0,
          amenityId: [],
          orderType: 0,
        }));
      } catch (error) {
        console.log("전체 검색", error);
        setIsLoading(false);
      }
    } else {
      try {
        const res = await axios.get(url);
        // console.log(res.data);
        const resultData = res.data;
        if (resultData) {
          setIsLoading(false);
        }
        setSearchRecoil(prev => ({
          ...prev,
          searchData: resultData.data,
        }));
      } catch (error) {
        console.log("전체 검색", error);
        setIsLoading(false);
      }
    }
  }, []);
  // api 카테고리 검색
  const getCategorySearch = async () => {
    const url = "/api/search/category";
    setIsLoading(true);
    if (accessToken) {
      try {
        const res = await axios.get(
          `${url}?start_idx=${searchRecoil.start_idx}&category=${
            categoryArr[category].name
          }&search_word=${keyword}&order_type=${orderTypeArr[orderType].type}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const resultData = res.data;
        if (resultData.code === "200 성공") {
          setIsLoading(false);
          setSearchRecoil(prev => ({
            ...prev,
            searchData: [...prev.searchData, ...resultData.data],
            more: resultData.data[0]?.more,
          }));
        }
      } catch (error) {
        console.log("카테고리 검색", error);
      }
    } else {
      try {
        const res = await axios.get(
          `${url}?start_idx=${searchRecoil.start_idx}&category=${
            categoryArr[category].name
          }&search_word=${keyword}&order_type=${orderTypeArr[orderType].type}`,
        );
        const resultData = res.data;
        if (resultData.code === "200 성공") {
          setIsLoading(false);
          setSearchRecoil(prev => ({
            ...prev,
            searchData: [...prev.searchData, ...resultData.data],
            more: resultData.data[0]?.more,
          }));
        }
      } catch (error) {
        console.log("카테고리 검색", error);
      }
    }
  };
  // api 편의시설 검색 더보기
  const getAmenitySearch = useCallback(async () => {
    const amenityIds = searchRecoil.amenityId
      .map(item => `amenity_id=${item.amenity_id}`)
      .join("&");
    try {
      const res = await axios.get(
        `/api/search/filter?start_idx=${searchRecoil.start_idx}&category=숙소&search_word=${keyword}&${amenityIds}`,
      );
      console.log("편의시설", res.data);
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        setSearchRecoil(prev => ({
          ...prev,
          searchData: [...prev.searchData, ...resultData.data],
          more: resultData.data[0].more,
        }));
      }
    } catch (error) {
      console.log("편의시설", error);
    }
  }, []);

  // api 검색 총 수
  const getSearchCount = async () => {
    try {
      const res = await axios.get(
        `/api/search/count?category=${categoryArr[category].name}&search_word=${keyword}`,
      );
      console.log("검색 총 수", res.data);
      setSearchRecoil(prev => ({ ...prev, count: res.data.data }));
    } catch (error) {
      console.log("검색 총 수", error);
    }
  };

  // 검색 엔터
  const handleClickEnter = e => {
    resetSearch();
    if (e.target.value.trim()) {
      setSearchRecoil(prev => ({
        ...prev,
        fromContent: false,
      }));
      navigate(`/search/strf?keyword=${e.target.value}&category=0&orderType=0`);
    }
  };
  // 카테고리 선택
  const handleChangeCategory = index => {
    navigate(
      `/search/strf?keyword=${keyword}&category=${index}&orderType=${orderType}`,
    );
    if (index !== category) {
      setSearchRecoil(prev => ({
        ...prev,
        start_idx: 0,
        searchData: [],
        category: index,
        fromContent: false,
      }));
    }
  };
  // 정렬 선택
  const handleOrderTypeChange = value => {
    navigate(
      `/search/strf?keyword=${keyword}&category=${category}&orderType=${value}`,
    );
    setSearchRecoil(prev => ({
      ...prev,
      orderType: value,
      start_idx: 0,
      fromContent: false,
      searchData: [],
    }));
  };
  // 더보기
  const handleClickMore = () => {
    setSearchRecoil(prev => ({
      ...prev,
      start_idx: prev.start_idx + 10,
    }));
    getCategorySearch();
  };

  // 편의시설 필터 모달
  const showAmenityFilter = () => {
    setIsAmenityOpen(true);
  };
  // 로딩

  useEffect(() => {
    if (category === 0) {
      postSearchAll(keyword);
    } else {
      if (searchValue.fromContent === false) {
        getCategorySearch();
        getSearchCount();
      }
    }
  }, [keyword, category, orderType]);

  return (
    <div className="w-full flex flex-col mb-[100px]">
      {/* 상단 */}
      <section
        className="w-full px-4 py-4 flex items-center gap-3 relative"
        ref={topRef}
      >
        {/* 뒤로가기 */}
        <div
          className="text-3xl cursor-pointer"
          onClick={() => {
            if (category === 0) {
              navigate(`/search/before`);
            } else {
              navigate(
                `/search/strf?keyword=${keyword}&category=0&orderType=${orderType}`,
              );
            }
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
            defaultValue={keyword}
            onPressEnter={e => handleClickEnter(e)}
            variant="filled"
            className="max-h-[60px] h-[16vw] text-base rounded-lg gap-[5px]
            bg-slate-50 hover:bg-slate-100 placeholder:text-slate-400 "
          />
        </label>
      </section>
      {/* 카테고리/정렬 */}
      <section className="pb-8 flex flex-col">
        {/* 카테고리 */}
        <ul className="py-4 flex gap-3 px-4 ">
          {categoryArr.map((item, index) => {
            return (
              <li
                key={index}
                className={`cursor-pointer text-sm w-full flex justify-center items-center py-2 gap-[10px] rounded-xl ${
                  index === category
                    ? "bg-primary text-white"
                    : "bg-white text-slate-500"
                }`}
                onClick={() => {
                  handleChangeCategory(index);
                }}
              >
                <p className="text-center"> {item.name}</p>
              </li>
            );
          })}
        </ul>
        <div className="h-[2.66vw] max-h-[10px] bg-slate-100"></div>
        {/* 총 개수, 정렬 방식 */}
        {category !== 0 && (
          <div className="flex items-center gap-3 justify-between px-4 py-4">
            <div className="text-sm text-slate-700 font-semibold">
              {category === 0 ? null : `총 ${searchValue.count}개`}
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={showAmenityFilter}
                type="button"
                className={`text-xs
                    ${category === 2 ? "visible" : "invisible"}
                    ${filter === "selected" ? "text-primary" : "text-slate-500"}`}
              >
                필터 <VscSettings />
              </Button>
              {category !== 0 && (
                <Select
                  value={searchValue.orderType}
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
            </div>
          </div>
        )}
      </section>
      {/* 검색 결과 */}
      <section className="px-8 pb-8 flex flex-col min-h-screen">
        <Spin spinning={isLoading}>
          {searchValue.searchData.length === 0 && isLoading === true && (
            <div className="flex flex-col items-center p-20">
              {/* 로딩 공백 방지용 */}
            </div>
          )}
          {searchValue.searchData.length === 0 && isLoading === false && (
            <NoData content="검색 결과가 없습니다." />
          )}
          {searchValue.searchData.length > 0 && category === 0 && <SearchAll />}

          {searchValue.searchData.length > 0 && category !== 0 && (
            <ul className="flex flex-col gap-[20px]">
              {searchValue.searchData.map((item, index) => {
                return <SearchItem key={index} item={item} />;
              })}
            </ul>
          )}
        </Spin>

        {category !== 0 && searchValue.more && (
          <div className="flex justify-center items-center py-4">
            <Button
              className="px-5 py-4 border border-slate-300 
        rounded-3xl text-base text-slate-600"
              onClick={() => {
                if (filter === "none") {
                  handleClickMore();
                } else {
                  getAmenitySearch();
                }
              }}
            >
              더보기
            </Button>
          </div>
        )}
      </section>

      {/* 편의시설 필터 모달 */}
      {isAmenityOpen && <AmenityFilter setIsAmenityOpen={setIsAmenityOpen} />}
    </div>
  );
};

export default SearchAfter;
