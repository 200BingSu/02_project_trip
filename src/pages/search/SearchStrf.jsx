import { Button, Checkbox, Form, Input } from "antd";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowRoundBack } from "react-icons/io";
import { RiCloseLargeFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
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

const SearchStrf = () => {
  const [form] = Form.useForm();
  //recoil
  const [searchRecoil, setSearchRecoil] = useRecoilState(searchAtom);
  const { userId } = useRecoilValue(userAtom);
  //쿠키
  const accessToken = getCookie("accessToken");
  //useRef
  const topRef = useRef(null);
  //useNavigate
  const navigate = useNavigate();
  const navigateToBack = () => {
    navigate(-1);
    setSearchValue("");
  };
  //useState
  const [searchState, setSearchState] = useState(
    searchRecoil.searchWord !== "" ? true : false,
  ); // 검색 상태
  const [searchValue, setSearchValue] = useState(searchRecoil.searchWord || ""); // 검색어
  const [searchData, setSearchData] = useState(searchRecoil.searchData || []); // 검색 결과
  const [lastIndex, setLastIndex] = useState(searchRecoil.lastIndex || 0); // 마지막 인덱스

  const [popularWordList, setPopularWordList] = useState([]); // 인기 검색어
  const [recentContents, setRecentContents] = useState([]); // 최근 본 목록
  const [recentText, setRecentText] = useState([]); // 최근 검색어
  const [selectedCategory, setSelectedCategory] = useState(0); // 선택된 카테고리
  const [orderType, setOrderType] = useState(0); // 정렬 타입
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [isSearchLoading, setIsSearchLoading] = useState(false); // 검색 로딩

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
  // api 최근 검색 목록
  const getBasicList = useCallback(async () => {
    try {
      const res = await jwtAxios.get(`/api/search/basic?user_id=${userId}`);
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
  const postSearchAll = useCallback(async () => {
    const sendData = { search_word: searchValue };
    console.log("sendData", sendData);
    try {
      const res = await axios.post(
        `/api/search/all?search_word=${searchValue}`,
        sendData,
      );
      console.log(res.data);
      const resultData = res.data;
      if (resultData) {
        setIsSearchLoading(true);
      }
      setSearchData(resultData.data);
    } catch (error) {
      console.log("전체 검색", error);
    }
  }, []);
  // api 카테고리 검색
  const getCategorySearch = useCallback(async () => {
    try {
      const res = await axios.get(
        `/api/search/category?
    last_index=${lastIndex}&
    category=${categoryArr[selectedCategory].type}&
    search_word=${searchValue}&
    order_type=${orderTypeArr[orderType].type}`,
      );
      console.log("카테고리 검색", res.data);
      const resultData = res.data;
      setSearchData([...searchData, ...resultData.data]);
      setLastIndex(prev => prev + 10);
    } catch (error) {
      console.log("카테고리 검색", error);
    }
  }, []);
  // 카테고리 별 데이터
  const tourData = searchData.filter(item => item.category === "TOUR");
  const stayData = searchData.filter(item => item.category === "STAY");
  const restaurData = searchData.filter(item => item.category === "RESTAUR");
  const festData = searchData.filter(item => item.category === "FEST");
  // 검색창 비우기
  const onChange = e => {
    setSearchValue(e.target.value);
  };
  // 최근 검색어 클릭
  const handleClickRecentText = useCallback(word => {
    console.log("클릭한 최근 검색어:", word);
  }, []);
  // 인기 검색어 클릭
  const handleClickPopularWord = useCallback(word => {
    console.log("클릭한 인기 검색어:", word);
    // setSearchValue(word.strfName);
    navigate(`/contents/index?strfId=${word.strfId}`);
  }, []);
  const handleClickClear = useCallback(() => {
    setSearchValue("");
  }, []);
  //모달 취소
  const handleClickCancle = () => {
    setIsModalOpen(false);
  };
  // 검색 엔터
  const handleClickEnter = () => {
    postSearchAll(searchValue);
    setSearchRecoil({ ...searchRecoil, searchWord: searchValue });
    setSearchState(true);
  };
  // 카테고리 검색 내 더보기
  const handleClickMore = () => {
    getCategorySearch();
  };
  // 편의시설 필터 적용 함수 수정
  const handleFinish = values => {
    console.log("values", values.amenities);
    setAmenityValues(values.amenities);
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
    console.log("searchValue", searchValue);
    setSearchRecoil({ ...searchRecoil, searchWord: searchValue });
  }, [searchValue]);
  useEffect(() => {
    setSearchRecoil({ ...searchRecoil, lastIndex: lastIndex });
  }, [lastIndex]);
  useEffect(() => {
    setLastIndex(0);
    if (selectedCategory !== 0) {
      getCategorySearch();
    }
  }, [orderType, selectedCategory]);
  useEffect(() => {
    if (searchData.length > 0) {
      setSearchRecoil({ ...searchRecoil, searchData: searchData });
    }
  }, [searchData]);

  return (
    <div className="w-full flex flex-col gap-[30px] mb-[100px]">
      {/* 상단 */}
      <div className="w-full px-[32px] py-[30px] flex items-center gap-[40px] relative">
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
            onChange={e => onChange(e)}
            onPressEnter={() => handleClickEnter()}
            variant="filled"
            value={searchValue}
          />
        </label>
      </div>

      {/* 카테고리와 검색 결과 */}
      {searchState ? (
        <div className="px-[32px] py-[30px] flex flex-col gap-[30px] min-h-screen">
          {/* 카테고리 */}
          <ul className="flex justify-between items-center" ref={topRef}>
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
                    setSelectedCategory(index);
                  }}
                >
                  {item.name}
                </li>
              );
            })}
          </ul>
          {/* 정렬 방식 */}
          <ul className="flex items-center">
            {orderTypeArr.map((item, index) => {
              return (
                <li
                  key={index}
                  className={`cursor-pointer font-semibold text-[13px] flex items-center px-3 py-1  ${
                    index === orderType ? "text-primary" : "text-slate-500"
                  }`}
                  onClick={() => setOrderType(index)}
                >
                  {item.name}
                </li>
              );
            })}
          </ul>
          {/* 편의시설 필터 */}
          {selectedCategory === 2 && (
            <Form form={form} onFinish={handleFinish}>
              <Form.Item
                name="amenities"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 cursor-pointer"
              >
                <Checkbox.Group className="flex flex-wrap gap-2">
                  {amenities.map((item, index) => {
                    return (
                      <Checkbox value={item.amenity_id} key={index}>
                        <div className="flex justify-center items-center gap-2">
                          <span className="text-[16px] text-slate-500">
                            {item.icon}
                          </span>
                          <span className="text-[14px] text-slate-700">
                            {item.key}
                          </span>
                        </div>
                      </Checkbox>
                    );
                  })}
                </Checkbox.Group>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  적용
                </Button>
              </Form.Item>
            </Form>
          )}
          {/* 검색 결과 */}
          {isSearchLoading ? (
            searchData.length === 0 ? (
              <div className="flex flex-col gap-[20px] items-center py-[100px]">
                <i className="text-slate-300 text-[100px]">
                  <LiaComment />
                </i>
                <p className="text-slate-400 text-[20px]">
                  검색 결과가 없습니다.
                </p>
              </div>
            ) : (
              (selectedCategory === 0 && (
                <div className="flex flex-col gap-[30px]">
                  {categoryArr.slice(1).map((item, index) => {
                    return (
                      <SearchCategoryList
                        key={index}
                        title={item.name}
                        categoryData={item.data}
                        searchValue={searchValue}
                        // buttonClick={moveTo(topRef)}
                      />
                    );
                  })}
                </div>
              ),
              selectedCategory === 1 && (
                <SearchCategoryList
                  title={categoryArr[1].name}
                  categoryData={searchData}
                  searchValue={searchValue}
                  buttonClick={handleClickMore}
                />
              ),
              selectedCategory === 2 && (
                <SearchCategoryList
                  title={categoryArr[2].name}
                  categoryData={searchData}
                  searchValue={searchValue}
                  buttonClick={handleClickMore}
                />
              ),
              selectedCategory === 3 && (
                <SearchCategoryList
                  title={categoryArr[3].name}
                  categoryData={searchData}
                  searchValue={searchValue}
                  buttonClick={handleClickMore}
                />
              ),
              selectedCategory === 4 && (
                <SearchCategoryList
                  title={categoryArr[4].name}
                  categoryData={searchData}
                  searchValue={searchValue}
                  buttonClick={handleClickMore}
                />
              ))
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
    </div>
  );
};

export default SearchStrf;
