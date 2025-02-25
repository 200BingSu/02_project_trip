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
import { FiSearch } from "react-icons/fi";
import { IoIosArrowRoundBack, IoIosArrowUp } from "react-icons/io";
import { RiCloseLargeFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import jwtAxios from "../../apis/jwt";
import { searchAtom } from "../../atoms/searchAtom";
import { userAtom } from "../../atoms/userAtom";
import CenterModal from "../../components/common/CenterModal";
import { ProductPic } from "../../constants/pic";
import { getCookie } from "../../utils/cookie";
import { categoryKor } from "../../utils/match";
import SearchCategoryList from "../../components/search/SearchCategoryList";
import { LiaComment } from "react-icons/lia";
import PulseLoader from "react-spinners/PulseLoader";
import { amenities, strfArr } from "../../constants/dataArr";
import { moveTo } from "../../utils/moveTo";
import { categoryArr, orderTypeArr } from "../../constants/search";

import AmenityFilter from "../../components/search/AmenityFilter";
import { resetSearchData } from "../../selectors/searchSelector";

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
  //useState
  const [searchState, setSearchState] = useState(
    searchRecoil.searchWord !== "" ? true : false,
  ); // 검색 상태
  const [searchValue, setSearchValue] = useState(searchRecoil.searchWord || ""); // 검색어
  const [searchData, setSearchData] = useState(searchRecoil.searchData || []); // 검색 결과
  const [startIndex, setStartIndex] = useState(searchRecoil.startIndex || 0); // 마지막 인덱스

  const [popularWordList, setPopularWordList] = useState([]); // 인기 검색어
  const [recentContents, setRecentContents] = useState([]); // 최근 본 목록
  const [recentText, setRecentText] = useState([]); // 최근 검색어
  const [selectedCategory, setSelectedCategory] = useState(
    searchRecoil.category || 0,
  ); // 선택된 카테고리
  const [orderType, setOrderType] = useState(0); // 정렬 타입
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [isSearchLoading, setIsSearchLoading] = useState(false); // 검색 로딩
  const [isShowMore, setIsShowMore] = useState(true); // 더보기 상태
  const [isAmenityOpen, setIsAmenityOpen] = useState(false); // 편의시설 열림 상태

  // Form 초기값 상태 수정
  const [amenityValues, setAmenityValues] = useState([]);

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
        // console.log(res.data);
        const resultData = res.data;
        if (resultData) {
          setIsSearchLoading(true);
          setSearchState(true);
        }
        setSearchData(resultData.data);
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
        setSearchData(resultData.data);
      } catch (error) {
        console.log("전체 검색", error);
      }
    }
  }, []);
  // api 카테고리 검색
  const getCategorySearch = useCallback(async () => {
    // console.log(
    //   `selectedCategory: ${selectedCategory}`,
    //   categoryArr[selectedCategory].name,
    // );
    try {
      // startIndex를 직접 참조하는 대신 함수 파라미터로 받도록 수정
      const currentIndex = startIndex;
      const res = await axios.get(
        `/api/search/category?start_idx=${currentIndex}&category=${
          categoryArr[selectedCategory].name
        }&search_word=${searchValue}&order_type=${orderTypeArr[orderType].type}`,
      );
      // console.log("카테고리 검색", res.data);
      const resultData = res.data;
      if (resultData) {
        setIsSearchLoading(true);
      }
      // 데이터가 있을 때만 startIndex 증가
      if (resultData.data && resultData.data.length > 0) {
        setSearchData(prev =>
          currentIndex === 0 ? resultData.data : [...prev, ...resultData.data],
        );
        setStartIndex(currentIndex + 10);
      }
      if (resultData.data[0]?.more === false) {
        setIsShowMore(false);
      }
    } catch (error) {
      console.log("카테고리 검색", error);
    }
  }, [selectedCategory, startIndex, searchValue, orderType]);
  // api 편의시설 검색
  const getAmenitySearch = useCallback(async amenityIds => {
    try {
      const res = await axios.get(
        `/api/search/filter?start_idx=0&category=숙소&search_word=${searchRecoil.searchWord}&${amenityIds}`,
      );
      console.log("편의시설", res.data);
      const resultData = res.data;
      if (resultData.data.more === false) {
        setIsShowMore(false);
      }
      setSearchData(resultData.data);
    } catch (error) {
      console.log("편의시설", error);
    }
  }, []);
  // 카테고리 별 데이터
  const tourData = searchData?.filter(item => item.category === "TOUR");
  const stayData = searchData?.filter(item => item.category === "STAY");
  const restaurData = searchData?.filter(item => item.category === "RESTAUR");
  const festData = searchData?.filter(item => item.category === "FEST");
  // 검색창 비우기
  const onChange = e => {
    setSearchValue(e.target.value);
  };
  // 최근 검색어 클릭
  const handleClickRecentText = useCallback(word => {
    console.log("클릭한 최근 검색어:", word);
    setSearchValue(word.txt);
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
    setSearchValue("");
  }, []);
  //모달 취소
  const handleClickCancle = () => {
    setIsModalOpen(false);
  };
  // 검색 엔터
  const handleClickEnter = e => {
    if (!searchValue.trim()) return; // 빈 검색어 체크
    setIsSearchLoading(false); // 로딩 상태 초기화
    postSearchAll(e.target.value);
    setSearchRecoil({ ...searchRecoil, searchWord: searchValue });
    setSearchState(true);
  };
  // 전체보기에서 더보기 클릭
  const handleClickAllMore = cateNum => {
    moveTo(topRef);
    setSelectedCategory(cateNum);
    setSearchRecoil({ ...searchRecoil, category: cateNum });
  };

  // 카테고리 검색 내 더보기
  const handleClickMore = () => {
    getCategorySearch();
  };
  // 편의시설 필터 모달
  const showAmenityFilter = () => {
    setIsAmenityOpen(true);
  };
  const handleClickAmenityFilter = () => {
    setIsAmenityOpen(false);
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
    // console.log("searchValue", searchValue);
    if (searchValue !== "") {
      setSearchRecoil({ ...searchRecoil, searchWord: searchValue });
    }
  }, [searchValue]);
  useEffect(() => {
    // 카테고리 변경 시 상태 초기화를 즉시 실행
    setStartIndex(0);
    setIsSearchLoading(false);
    setSearchData([]);
    setIsShowMore(true);
    setSearchRecoil(prev => ({ ...prev, startIndex: 0, searchData: [] }));

    // searchValue가 비어있지 않을 때만 검색 실행
    if (searchValue.trim()) {
      const timer = setTimeout(() => {
        if (selectedCategory !== 0) {
          getCategorySearch();
        } else {
          postSearchAll(searchValue);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedCategory, orderType]);
  useEffect(() => {
    // console.log("searchData", searchData);
    if (searchData?.length > 0) {
      setSearchRecoil({ ...searchRecoil, searchData: searchData });
    }
  }, [searchData]);

  return (
    <div className="w-full flex flex-col gap-[30px] mb-[100px]">
      {/* 상단 */}
      <div
        className="w-full px-[32px] py-[30px] flex items-center gap-[40px] relative"
        ref={topRef}
      >
        {/* 뒤로가기 */}
        <div
          className="text-[36px] cursor-pointer"
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
            className="h-[60px] text-lg rounded-lg gap-[5px]"
            placeholder="관광지, 장소, 숙소,맛집을 검색해 보세요"
            allowClear
            onClear={handleClickClear}
            prefix={<FiSearch className="text-slate-400 text-2xl" />}
            onChange={onChange}
            onPressEnter={e => {
              if (e.target.value.trim()) {
                handleClickEnter(e);
              }
            }}
            variant="filled"
            value={searchValue}
          />
        </label>
      </div>

      {/* 카테고리와 검색 결과 */}
      {searchState ? (
        <div className="px-[32px] py-[30px] flex flex-col gap-[30px] min-h-screen">
          {/* 카테고리 */}
          <ul className="flex justify-between items-center">
            {categoryArr.map((item, index) => {
              return (
                <li
                  key={index}
                  className={`cursor-pointer font-semibold text-[16px] w-full flex justify-center items-center px-[15px] py-[10px] gap-[10px] rounded-[8px] ${
                    index === selectedCategory
                      ? "bg-primary text-white"
                      : "bg-white text-slate-500"
                  }`}
                  onClick={() => {
                    setStartIndex(0);
                    setSelectedCategory(index);
                    setSearchRecoil({ ...searchRecoil, category: index });
                  }}
                >
                  {item.name}
                </li>
              );
            })}
          </ul>
          {/* 정렬 방식 */}
          <div className="flex items-center gap-3">
            {selectedCategory !== 0 && (
              <Select
                value={orderType}
                onChange={value => {
                  setOrderType(value);
                  setStartIndex(0);
                }}
                options={orderTypeArr.map((item, index) => ({
                  value: index,
                  label: item.name,
                }))}
                className="w-[120px]"
                size="middle"
              />
            )}
            <div>
              {selectedCategory === 2 && (
                <Button onClick={showAmenityFilter}>편의시설 필터</Button>
              )}
            </div>
          </div>

          {/* 검색 결과 */}
          {isSearchLoading ? (
            searchData?.length === 0 ? (
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
                {selectedCategory === 0 && (
                  <div className="flex flex-col gap-[30px]">
                    <SearchCategoryList
                      title={categoryArr[1].name}
                      categoryData={tourData}
                      searchValue={searchValue}
                      buttonClick={() => {
                        handleClickAllMore(1);
                      }}
                    />
                    <SearchCategoryList
                      title={categoryArr[2].name}
                      categoryData={stayData}
                      searchValue={searchValue}
                      buttonClick={() => {
                        handleClickAllMore(2);
                      }}
                    />
                    <SearchCategoryList
                      title={categoryArr[3].name}
                      categoryData={restaurData}
                      searchValue={searchValue}
                      buttonClick={() => {
                        handleClickAllMore(3);
                      }}
                    />
                    <SearchCategoryList
                      title={categoryArr[4].name}
                      categoryData={festData}
                      searchValue={searchValue}
                      buttonClick={() => {
                        handleClickAllMore(4);
                      }}
                    />
                  </div>
                )}
                {selectedCategory === 1 && (
                  <SearchCategoryList
                    title={categoryArr[1].name}
                    categoryData={searchData}
                    searchValue={searchValue}
                    buttonClick={handleClickMore}
                    showMore={isShowMore}
                  />
                )}
                {selectedCategory === 2 && (
                  <SearchCategoryList
                    title={categoryArr[2].name}
                    categoryData={searchData}
                    searchValue={searchValue}
                    buttonClick={handleClickMore}
                    showMore={isShowMore}
                  />
                )}
                {selectedCategory === 3 && (
                  <SearchCategoryList
                    title={categoryArr[3].name}
                    categoryData={searchData}
                    searchValue={searchValue}
                    buttonClick={handleClickMore}
                    showMore={isShowMore}
                  />
                )}
                {selectedCategory === 4 && (
                  <SearchCategoryList
                    title={categoryArr[4].name}
                    categoryData={searchData}
                    searchValue={searchValue}
                    buttonClick={handleClickMore}
                    showMore={isShowMore}
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
        <div className="px-[32px] flex flex-col gap-[50px]">
          {/* 최근 검색어 */}
          {accessToken && (
            <div className="flex flex-col gap-[30px]">
              <h2 className="text-[24px] font-semibold text-slate-700">
                최근 검색어
              </h2>
              {/* 최근 검색어 목록 */}
              <ul className="flex gap-[20px] flex-wrap">
                {recentText ? (
                  recentText?.map((item, index) => {
                    return (
                      <li
                        key={index}
                        className="cursor-pointer text-slate-700 bg-slate-50 px-[20px] py-[10px] rounded-[20px]"
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
            <h2 className="text-[24px] font-semibold text-slate-700">
              인기 검색어
            </h2>
            {/* 인기 검색어 목록 */}
            <ul className="flex gap-[20px] flex-wrap">
              {popularWordList ? (
                popularWordList?.map((item, index) => {
                  return (
                    <li
                      key={index}
                      className="cursor-pointer text-slate-700 bg-slate-50 px-[20px] py-[10px] rounded-[20px]"
                      onClick={() => handleClickPopularWord(item)}
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
          {accessToken && (
            <div className="flex flex-col gap-[30px]">
              <div className="flex justify-between items-center">
                <h2 className="text-[24px] font-semibold text-slate-700">
                  최근 본 목록
                </h2>
                <button
                  type="button"
                  className="text-slate-400 text-[18px]"
                  onClick={() => setIsModalOpen(true)}
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
                          onClick={() => handleClickList(item)}
                        >
                          <div className="flex gap-[15px]">
                            <div className="w-[80px] h-[80px] rounded-2xl overflow-hidden">
                              <img
                                className="w-full h-full object-cover"
                                src={
                                  item.strfPic
                                    ? `${ProductPic}${item.strfId}/${item.strfPic}`
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
      {isAmenityOpen && (
        <AmenityFilter
          searchData={searchData}
          setSearchData={setSearchData}
          amenityValues={amenityValues}
          setAmenityValues={setAmenityValues}
          handleClickCancle={handleClickAmenityFilter}
          getAmenitySearch={getAmenitySearch}
          content="편의시설 필터"
        />
      )}
    </div>
  );
};

export default SearchStrf;
