import { Input } from "antd";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowRoundBack } from "react-icons/io";
import { RiCloseLargeFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import jwtAxios from "../../apis/jwt";
import { searchAtom } from "../../atoms/searchAtom";
import { userAtom } from "../../atoms/userAtom";
import DeleteModal from "../../components/common/DeleteModal";
import { ProductPic } from "../../constants/pic";
import { getCookie } from "../../utils/cookie";
import { categoryKor } from "../../utils/match";
import SearchCategoryList from "../../components/search/SearchCategoryList";
import { LiaComment } from "react-icons/lia";
import PulseLoader from "react-spinners/PulseLoader";

// 카테고리 배열
const categoryArr = [
  { type: "all", name: "전체" },
  { type: "TOUR", name: "관광지" },
  { type: "STAY", name: "숙소" },
  { type: "RESTAUR", name: "맛집" },
  { type: "FEST", name: "축제" },
];

const SearchStrf = () => {
  //recoil
  const [searchRecoil, setSearchRecoil] = useRecoilState(searchAtom);
  const { userId } = useRecoilValue(userAtom);
  //쿠키
  const accessToken = getCookie("accessToken");
  //useNavigate
  const navigate = useNavigate();

  //useState
  const [searchState, setSearchState] = useState(false); // 검색 상태

  const [popularWordList, setPopularWordList] = useState([]); // 인기 검색어
  const [recentContents, setRecentContents] = useState([]); // 최근 본 목록
  const [recentText, setRecentText] = useState([]); // 최근 검색어
  const [selectedCategory, setSelectedCategory] = useState(0); // 선택된 카테고리
  const [searchData, setSearchData] = useState([]); // 검색 결과
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [isSearchLoading, setIsSearchLoading] = useState(false); // 검색 로딩
  const [searchValue, setSearchValue] = useState(""); // 검색 값
  useEffect(() => {
    console.log("searchValue", searchValue);
  }, [searchValue]);
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
  // api 최근 본 목록 전체 삭제
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
        setIsModalOpen(false);
      }
    } catch (error) {
      console.log("개별 삭제", error);
    }
  };
  // api 전체 검색
  const postSearchAll = async () => {
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
  };
  // api 카테고리 검색
  const getCategorySearch = () => {};
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
    setSearchRecoil({ searchWord: word.txt });
  }, []);
  // 인기 검색어 클릭
  const handleClickPopularWord = useCallback(word => {
    console.log("클릭한 인기 검색어:", word);
    // setSearchValue(word.strfName);
    navigate(`/contents/index?strfId=${word.strfId}`);
  }, []);
  //모달 취소
  const handleClickCancle = () => {
    setIsModalOpen(false);
  };
  // 검색 엔터
  const handleClickEnter = () => {
    postSearchAll(searchValue);
    setSearchState(true);
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
    <div className="w-full flex flex-col gap-[30px] mb-[100px]">
      {/* 상단 */}
      <div className="w-full px-[32px] py-[30px] flex items-center gap-[40px] relative">
        {/* 뒤로가기 */}
        <div
          className="text-[36px] cursor-pointer"
          onClick={() => {
            navigate(-1);
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
            prefix={<FiSearch className="text-slate-400 text-2xl" />}
            onChange={e => onChange(e)}
            onPressEnter={() => handleClickEnter()}
            variant="filled"
          />
        </label>
      </div>

      {/* 카테고리와 검색 결과 */}
      {searchState ? (
        <div className="px-[32px] py-[30px] flex flex-col gap-[30px] min-h-screen">
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
                    setSelectedCategory(index);
                  }}
                >
                  {item.name}
                </li>
              );
            })}
          </ul>

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
              <div className="flex flex-col gap-[30px]">
                <SearchCategoryList title="관광지" categoryData={tourData} />
                <SearchCategoryList title="숙소" categoryData={stayData} />
                <SearchCategoryList title="맛집" categoryData={restaurData} />
                <SearchCategoryList title="축제" categoryData={festData} />
              </div>
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
        </div>
      )}

      {/* 모달 */}
      {isModalOpen && (
        <DeleteModal
          handleClickCancle={handleClickCancle}
          handleClickSubmit={patchRecentListAll}
          content="최근 본 목록을 모두 삭제하시겠습니까?"
        />
      )}
    </div>
  );
};

export default SearchStrf;
