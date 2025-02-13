import React, { useCallback, useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { searchAtom } from "../../atoms/searchAtom";
import { getCookie } from "../../utils/cookie";
import { FiSearch } from "react-icons/fi";
import { Input } from "antd";
import axios from "axios";
import jwtAxios from "../../apis/jwt";
import { userAtom } from "../../atoms/userAtom";
import { ProductPic } from "../../constants/pic";
import { categoryKor } from "../../utils/match";
import { RiCloseLargeFill } from "react-icons/ri";
import BottomModal from "../../components/common/BottomModal";
import DeleteModal from "../../components/common/DeleteModal";

const SearchStrf = () => {
  //recoil
  const [search, setSearch] = useRecoilState(searchAtom);
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
  const [searchData, setSearchData] = useState(); // 검색 결과
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

  const [searchValue, setSearchValue] = useState(""); // 검색 값
  // 인기 검색어
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
  // 최근 검색 목록
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
  // 최근 검색어
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
  //최근 본 목록 전체 삭제
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
  // 검색창 비우기
  const onChange = e => {};
  // 인기 검색어 클릭
  const handleClickWord = useCallback(word => {
    console.log("클릭한 인기 검색어:", word);
    setSearchValue(word.strfName);
    navigate(`/contents/index?strfId=${word.strfId}`);
  }, []);
  //모달 취소
  const handleClickCancle = () => {
    setIsModalOpen(false);
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
            onChange={e => onChange()}
            variant="filled"
          />
        </label>
      </div>
      {/* 검색 상태 */}
      {searchState ? (
        <></>
      ) : (
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
                      onClick={() => handleClickWord(item)}
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
