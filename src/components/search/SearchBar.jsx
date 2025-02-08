import { Input } from "antd";
import React, { useEffect, useState } from "react";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import { getCookie } from "../../utils/cookie";

const SearchBar = React.memo(
  ({
    searchValue,
    setSearchValue,
    setSearchState,
    searchData,
    setSearchData,
  }) => {
    const accessToken = getCookie("accessToken");
    //useNavigate
    const navigate = useNavigate();
    // useState
    const [searchBarFocus, setSearchBarFocus] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [recentText, setRecentText] = useState([]);
    useEffect(() => {
      // console.log("recentText", recentText);
    }, [recentText]);
    // 검색창 비우기
    const onChange = e => {};

    // 최근 검색어
    const getRecentText = async () => {
      try {
        const res = await axios.get(`/api/search/list`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const resultData = res.data;
        console.log(resultData);
        const filterArr = resultData.data.filter(item => {
          return item.txt !== "";
        });
        setRecentText(filterArr);
      } catch (error) {
        console.log("최근 검색어 호출 결과:", error);
      }
    };
    useEffect(() => {
      if (accessToken) {
        getRecentText();
      }
    }, []);
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
        console.log(resultData);
        setSearchData("최근 검색어 클릭 결과", resultData.data);
      } catch (error) {
        console.log(error);
      }
    };
    useEffect(() => {
      // console.log("최근 검색어", recentText);
    }, [recentText]);

    return (
      <div className="w-full px-[32px] py-[30px] flex items-center gap-[40px] relative ">
        {/* 뒤로가기 */}
        <div
          className="text-[36px] cursor-pointer"
          onClick={() => {
            navigate(-1);
          }}
        >
          <IoIosArrowRoundBack />
        </div>
        <Input
          placeholder="지금 어디로 여행을 떠나고 싶으신가요?"
          variant="borderless"
          allowClear
          onChange={e => {
            onChange();
            setInputValue(e.target.value);
          }}
          onKeyDown={e => {
            if (e.code === "Enter") {
              setSearchValue(e.target.value);
              setSearchState(true);
            }
          }}
          onFocus={() => {
            setSearchBarFocus(true);
          }}
          prefix={<FiSearch className="text-slate-400 text-2xl" />}
          className={`w-full h-[60px] px-[12px] ${inputValue ? "bg-white" : "bg-slate-100"}`}
        />
        {searchBarFocus ? (
          <div
            className="absolute top-[90%] translate-y-[0] left-[0]
          w-full flex justify-center items-center gap-[20px]"
          >
            {recentText ? (
              recentText?.map((item, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchValue(item.txt);
                      setSearchState(true);
                      setSearchBarFocus(false);
                      postSearchAll(item.txt);
                    }}
                    className="text-slate-600"
                  >
                    {item.txt}
                  </button>
                );
              })
            ) : (
              <li className="text-slate-700 text-[16px]">데이터 없음</li>
            )}
          </div>
        ) : null}
      </div>
    );
  },
);

export default SearchBar;
