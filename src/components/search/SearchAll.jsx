import React from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { searchAtom } from "../../atoms/searchAtom";
import SearchItem from "./SearchItem";
import { Button } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { moveTop } from "../../utils/moveTo";
import NoData from "../common/NoData";

const SearchAll = () => {
  // 쿼리
  const [searchPrams] = useSearchParams();
  const keyword = searchPrams.get("keyword");
  const category = searchPrams.get("category");
  const orderType = searchPrams.get("orderType");
  //router
  const navigate = useNavigate();
  // recoil
  const [searchRecoil, setSearchRecoil] = useRecoilState(searchAtom);
  const resetSearch = useResetRecoilState(searchAtom);
  const searchValue = useRecoilValue(searchAtom);

  const tourData = searchValue.searchData.filter(
    item => item.category === "TOUR",
  );
  const stayData = searchValue.searchData.filter(
    item => item.category === "STAY",
  );
  const restData = searchValue.searchData.filter(
    item => item.category === "RESTAUR",
  );
  const festData = searchValue.searchData.filter(
    item => item.category === "FEST",
  );

  const handleClickMore = category => {
    setSearchRecoil(prev => ({
      ...prev,
      category: category,
      searchData: [],
    }));
    navigate(
      `/search/strf?keyword=${keyword}&category=${category}&orderType=${orderType}`,
    );
    moveTop();
  };
  return (
    <>
      {searchValue.searchData.length === 0 && (
        <NoData content="검색 결과가 없습니다." />
      )}
      {searchValue.searchData.length > 0 && (
        <>
          {/* 관광지 */}
          <section className="flex flex-col gap-5 items-center mb-10">
            <h2 className="w-full text-lg font-semibold text-slate-700">
              관광지
            </h2>
            <ul className="w-full flex flex-col gap-5">
              {tourData.map((item, index) => {
                return <SearchItem key={index} item={item} />;
              })}
            </ul>
            <Button
              className="px-5 py-4 border border-slate-300 
        rounded-3xl text-base text-slate-600"
              onClick={() => handleClickMore(1)}
            >
              더보기
            </Button>
          </section>
          {/* 숙소 */}
          <section className="flex flex-col gap-5 items-center mb-10">
            <h2 className="w-full text-lg font-semibold text-slate-700">
              숙소
            </h2>
            <ul className="w-full flex flex-col gap-5">
              {stayData.map((item, index) => {
                return <SearchItem key={index} item={item} />;
              })}
            </ul>
            <Button
              className="px-5 py-4 border border-slate-300 
        rounded-3xl text-base text-slate-600"
              onClick={() => handleClickMore(2)}
            >
              더보기
            </Button>
          </section>
          {/* 맛집 */}
          <section className="flex flex-col gap-5 items-center mb-10">
            <h2 className="w-full text-lg font-semibold text-slate-700">
              맛집
            </h2>
            <ul className="w-full flex flex-col gap-5">
              {restData.map((item, index) => {
                return <SearchItem key={index} item={item} />;
              })}
            </ul>
            <Button
              className="px-5 py-4 border border-slate-300 
        rounded-3xl text-base text-slate-600"
              onClick={() => handleClickMore(3)}
            >
              더보기
            </Button>
          </section>
          {/* 축제 */}
          <section className="flex flex-col gap-5 items-center mb-10">
            <h2 className="w-full text-lg font-semibold text-slate-700">
              축제
            </h2>
            <ul className="w-full flex flex-col gap-5">
              {festData.map((item, index) => {
                return <SearchItem key={index} item={item} />;
              })}
            </ul>
            <Button
              className="px-5 py-4 border border-slate-300 
        rounded-3xl text-base text-slate-600"
              onClick={() => handleClickMore(4)}
            >
              더보기
            </Button>
          </section>
        </>
      )}
    </>
  );
};

export default SearchAll;
