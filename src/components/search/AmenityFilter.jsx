import { Button, Checkbox, Form } from "antd";
import { amenities } from "../../constants/dataArr";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { searchAtom } from "../../atoms/searchAtom";
import TitleHeader from "../layout/header/TitleHeader";
import { orderTypeArr } from "../../constants/search";
import { RiArrowGoBackFill } from "react-icons/ri";
import { useNavigate, useSearchParams } from "react-router-dom";

const AmenityFilter = ({ setIsAmenityOpen }) => {
  const [form] = Form.useForm();
  //쿼리
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const category = searchParams.get("category");
  const orderType = searchParams.get("orderType");
  const filter = searchParams.get("filter");
  // navigate
  const navigate = useNavigate();

  //recoil
  const [searchRecoil, setSearchRecoil] = useRecoilState(searchAtom);
  // api 편의시설 검색
  const getAmenitySearch = useCallback(async () => {
    const amenityIds = searchRecoil.amenityId
      .map(item => `amenity_id=${item.amenity_id}`)
      .join("&");
    try {
      const res = await axios.get(
        `/api/search/filter?start_idx=0&category=숙소&search_word=${keyword}&${amenityIds}`,
      );
      console.log("편의시설", res.data);
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        setSearchRecoil(prev => ({
          ...prev,
          searchData: resultData.data,
          more: resultData.data[0].more,
        }));
      }
    } catch (error) {
      console.log("편의시설", error);
    }
  }, []);
  useEffect(() => {
    console.log("선택된 필터", searchRecoil.amenityId);
  }, [searchRecoil.amenityId]);

  // 뒤로가기
  const handleClickBack = () => {
    setIsAmenityOpen(false);
    setSearchRecoil(prev => ({ ...prev, amenityId: [] }));
  };
  // 초기화
  const handleClickReset = () => {
    setSearchRecoil(prev => ({ ...prev, amenityId: [] }));
  };
  //정렬 변경
  const handleOrderTypeChange = index => {
    setSearchRecoil(prev => ({ ...prev, orderType: index }));
  };
  // 편의시설 선택
  const handleClickFilter = item => {
    if (searchRecoil.amenityId.includes(item)) {
      setSearchRecoil({
        ...searchRecoil,
        amenityId: searchRecoil.amenityId.filter(id => id !== item),
      });
    } else {
      setSearchRecoil({
        ...searchRecoil,
        amenityId: [...searchRecoil.amenityId, item],
      });
    }
  };
  // 적용하기
  const handleSubmit = () => {
    console.log("handleSubmit", searchRecoil);
    setSearchRecoil(prev => ({
      ...prev,
      fromContent: false,
    }));
    setIsAmenityOpen(false);
    if (searchRecoil.amenityId.length > 0) {
      getAmenitySearch();
      navigate(
        `/search/strf?keyword=${keyword}&category=${category}&orderType=${searchRecoil.orderType}&filter=selected`,
      );
    } else {
      navigate(
        `/search/strf?keyword=${keyword}&category=${category}&orderType=${searchRecoil.orderType}&filter=none`,
      );
    }
  };

  return (
    <div
      className="fixed top-0 left-[50%] translate-x-[-50%] z-10
            max-w-[768px] w-full mx-auto h-screen
            bg-white"
    >
      <div className="relative h-full">
        <TitleHeader title="필터" onClick={handleClickBack} />
        {/* 필터 */}
        <section className="flex flex-col gap-3">
          {/* 정렬 필터 */}
          <div className="px-4 py-6">
            <h4 className="py-2 text-base font-semibold text-slate-700">
              정렬
            </h4>
            <ul>
              {orderTypeArr.map((item, index) => {
                return (
                  <li
                    key={index}
                    className="py-3 border-b border-slate-100"
                    onClick={() => handleOrderTypeChange(index)}
                  >
                    <button
                      className={`text-sm  hover:text-primary transition-all duration-75
                      ${searchRecoil.orderType === index ? "text-primary" : "text-slate-700"}`}
                    >
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          {/* 편의시설 필터 */}
          <div className="px-4 py-6 flex flex-col gap-3">
            <h4 className="text-base font-semibold text-slate-700">편의시설</h4>
            <ul className="flex flex-wrap gap-[6px]">
              {amenities.map((item, index) => {
                return (
                  <li
                    key={index}
                    onClick={() => handleClickFilter(item)}
                    className={`w-fit px-3 py-[6px] rounded-lg border text-sm select-none cursor-pointer ${
                      searchRecoil.amenityId?.includes(item)
                        ? "text-primary border-primary"
                        : "text-slate-500 border-slate-200"
                    }`}
                  >
                    {item.key}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
        {/* 버튼 */}
        <section
          className=" absolute bottom-0 left-0 right-0 bg-white
      flex items-center gap-3 px-4 py-4 border-t border-slate-100"
        >
          <Button
            className="px-[14px] py-3 !h-auto text-base text-slate-500"
            onClick={handleClickReset}
          >
            <RiArrowGoBackFill className="text-slate-300" />
            초기화
          </Button>
          <Button
            type="primary"
            className="w-full px-[14px] py-3 !h-auto text-base"
            onClick={handleSubmit}
          >
            적용하기
          </Button>
        </section>
      </div>
    </div>
  );
};

export default AmenityFilter;
