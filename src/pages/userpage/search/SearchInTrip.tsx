import { Button, Input, Spin } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchTripItem from "../../../components/search/SearchTripItem";
import { categoryArr } from "../../../constants/search";
import { IAPI } from "../../../types/interface";
import { getCookie } from "../../../utils/cookie";

export interface IStrfItem {
  strfId: number;
  category: string;
  title: string;
  lat: number;
  lng: number;
  picTitle: string;
  ratingCnt: number;
  explain: null | string;
  wishCnt: number;
  avgRating: number;
  wishIn: false;
  ratingIn: false;
  startAt: null | string;
  endAt: null | string;
}
interface ISearchData {
  list: IStrfItem[];
  locationTitleList: string[] | null;
  more: boolean;
}

const SearchInTrip = () => {
  // 쿠키
  const accessToken = getCookie("accessToken");
  // 쿼리
  const [searchParams] = useSearchParams();
  const tripId = Number(searchParams.get("tripId"));
  const category = searchParams.get("category");
  const keyword = searchParams.get("keyword");
  const type = searchParams.get("type");
  //useNavigate
  const navigate = useNavigate();
  const navigateToBack = () => {
    navigate(-1);
  };

  const navigateToOtherCate = (item: { type: string; name: string }) => {
    // if (category !== item.type) {
    //   navigate(
    //     `/search/trip??tripId=${tripId}&category=${item.type}&keyword=${keyword}&type=basic`,
    //   );
    // }
    if (item.type !== "ALL") {
      navigate(
        `/search/trip?tripId=${tripId}&category=${item.type}&keyword=${text}&type=search`,
      );
    }
    if (item.type === "ALL") {
      navigate(
        `/search/trip?tripId=${tripId}&category=${item.type}&keyword=${text}&type=basic`,
      );
    }
  };
  //useState
  const [text, setText] = useState(keyword === "null" ? "" : keyword);
  const [isLoading, setIsLoading] = useState(false);
  const [startInx, setStartInx] = useState(0);
  const [searchList, setSearchList] = useState<IStrfItem[]>([]);
  const [isMore, setIsMore] = useState(true);
  // API 일정 추가 검색 기본
  const getSearchBasic = async (): Promise<IAPI<ISearchData> | null> => {
    const url = "/api/search/strf-list-basic";
    setIsLoading(true);
    try {
      const res = await axios.get<IAPI<ISearchData>>(
        `${url}?trip_id=${tripId}&start_idx=${startInx}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const resultData = res.data;
      console.log("일정 기본 검색", resultData);
      if (resultData.code === "200 성공") {
        setSearchList(resultData.data.list);
        setIsMore(resultData.data.more);
      }
      return resultData;
    } catch (error) {
      console.log("일정 추가 검색", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  //  API 일정 추가 검색
  const getSearchWord = async (): Promise<IAPI<ISearchData> | null> => {
    const url = "/api/search/strf-list-word";
    setIsLoading(true);
    try {
      const res = await axios.get<IAPI<ISearchData>>(
        category === "ALL"
          ? text?.trim() === ""
            ? `${url}?trip_id=${tripId}&start_idx=${startInx}`
            : `${url}?trip_id=${tripId}&start_idx=${startInx}&search_word=${text}`
          : text?.trim() === ""
            ? `${url}?trip_id=${tripId}&start_idx=${startInx}&category=${category}`
            : `${url}?trip_id=${tripId}&start_idx=${startInx}&category=${category}&search_word=${text}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const resultData = res.data;
      console.log("일정 추가 검색", resultData);
      if (resultData.code === "200 성공") {
        setSearchList(resultData.data.list);
        setIsMore(resultData.data.more);
      }
      return resultData;
    } catch (error) {
      console.log("일정 추가 검색", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  //   검색어 입력
  const submitKeyword = () => {
    navigate(
      `/search/trip?tripId=${tripId}&category=${category}&keyword=${text}&type=search`,
    );
  };
  // 카테고리 선택
  const handleChangeCategory = (item: { type: string; name: string }) => {
    console.log(item.type);
    setSearchList([]);
    navigateToOtherCate(item);
  };
  const handleClickMore = () => {
    setStartInx(prev => prev + 10);
  };

  useEffect(() => {
    if (type === "basic") {
      getSearchBasic();
    }
    if (type === "search") {
      getSearchWord();
    }
  }, [keyword, category, type, startInx]);

  return (
    <div>
      {/* 검색바 */}
      <section className="w-full px-8 py-7 flex items-center gap-10 relative ">
        {/* 뒤로가기 */}
        <div className="text-3xl cursor-pointer" onClick={navigateToBack}>
          <IoIosArrowRoundBack />
        </div>
        <Input
          placeholder="지금 어디로 여행을 떠나고 싶으신가요?"
          variant="borderless"
          suffix={
            <button type="button" onClick={submitKeyword}>
              <FiSearch className="text-slate-400 text-2xl" />
            </button>
          }
          allowClear
          value={text as string}
          onChange={e => setText(e.target.value)}
          onPressEnter={submitKeyword}
        />
      </section>
      {/* 카테고리 */}
      <section>
        <ul className="flex gap-3 px-7 justify-between items-center">
          {categoryArr.map((item, index) => {
            return (
              <li
                key={index}
                className={`cursor-pointer text-sm w-full flex justify-center items-center py-2 gap-3 rounded-xl 
                    ${
                      item.type === category
                        ? "bg-primary text-white"
                        : "bg-white text-slate-500"
                    }`}
                onClick={() => {
                  handleChangeCategory(item);
                }}
              >
                <p className="text-center"> {item.name}</p>
              </li>
            );
          })}
        </ul>
      </section>
      {/* 검색 결과 */}
      <section>
        <Spin spinning={isLoading}>
          <ul className="px-8 py-7 flex flex-col gap-8">
            {searchList.map((item, index) => {
              return <SearchTripItem item={item} key={index} />;
            })}
          </ul>
        </Spin>
        <div className="flex justify-center">
          {isMore && (
            <Button
              className="text-slate-500 text-base !h-auto py-2 px-5 border-1 border-slate-200 rounded-full"
              onClick={handleClickMore}
            >
              더보기
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default SearchInTrip;
