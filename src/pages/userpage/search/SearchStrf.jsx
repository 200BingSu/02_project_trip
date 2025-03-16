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
import { useNavigate, useSearchParams } from "react-router-dom";
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

  //useNavigate
  const navigate = useNavigate();
  const navigateToBack = () => {
    navigate(-1);
    resetSearch();
  };

  const [isSearchLoading, setIsSearchLoading] = useState(false); // 검색 로딩

  const [searchCount, setSearchCount] = useState(0); // 검색 총 수

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
  const handleClickClear = useCallback(() => {
    // setSearchRecoil(prev => ({ ...prev, searchWord: "" }));
  }, []);
  // 검색창 입력
  const onChange = e => {
    // setSearchRecoil(prev => ({ ...prev, searchWord: e.target.value }));
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
                navigate(`/search/strf?keyword=${e.target.value}`);
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
            {searchRecoil.category === 0 ? null : `총 ${searchRecoil.count}개`}
          </div>
          <div className="flex items-center gap-3">
            {searchRecoil.category !== 0 && (
              <Select
                value={searchRecoil.orderType}
                onChange={handleOrderTypeChange}
                options={orderTypeArr.map((item, index) => ({
                  value: index,
                  label: (
                    <span className="text-slate-500 text-xs">{item.name}</span>
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
    </div>
  );
};

export default SearchStrf;
