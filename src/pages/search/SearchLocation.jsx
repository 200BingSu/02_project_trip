import { Button, Checkbox, Form, Input, Skeleton } from "antd";
import React, { useEffect, useRef, useState } from "react";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import SearchBar from "../../components/search/SearchBar";
import SearchNone from "../../components/search/SearchNone";
import SearchList from "../../components/search/SearchList";
import { TRIP } from "../../constants/api";
import axios from "axios";

const SearchLocation = () => {
  //useNavigate
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state;
  const fromPage = locationState?.from;

  // 일정 관리 안 넣었음
  const hadleClickSubmitButton = () => {
    if (fromPage) {
      navigate(fromPage, { state: selectedLocationId });
    } else {
      navigate(`/schedule`);
    }
  };

  // useState
  const [locationData, setLocationData] = useState(null);
  const [selectedLocationId, setSelectedLocationId] = useState([]);
  const [searchState, setSearchState] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    console.log(searchValue);
  }, [searchValue]);
  //useRef
  const imgRef = useRef(null);
  useEffect(() => {
    if (imgRef.current) {
      console.log(imgRef.current);
    }
  }, []);
  //getLocationList
  const getLocationList = async () => {
    try {
      const res = await axios.get(TRIP.getLocationList);
      console.log("지역 목록 조회:", res.data);
      setLocationData(res.data);
    } catch (error) {
      console.log("지역 목록 조회:", error);
    }
  };
  useEffect(() => {
    getLocationList();
  }, []);

  const locationArr = locationData?.data.locationList;
  const sortArr = locationArr?.filter(item => item.title.includes(searchValue));

  // 지역 선택
  const handleClickSelect = item => {
    setSelectedLocationId([...selectedLocationId, item]);
  };
  const handleClickCancel = item => {
    setSelectedLocationId(
      selectedLocationId.filter(
        location => location.locationId !== item.locationId,
      ),
    );
  };

  // useEffect(() => {
  //   console.log("selectedLocationId", selectedLocationId);
  // }, [selectedLocationId]);
  return (
    <div>
      {/* 검색바 */}
      <SearchBar
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setSearchState={setSearchState}
      />
      {/* 지역 목록 */}
      <ul className="flex flex-col gap-[20px] px-[32px] mb-[20px]">
        {sortArr?.length > 0 ? (
          sortArr?.map(item => {
            return (
              <li
                className="flex justify-between items-center"
                key={item.locationId}
              >
                {/* 우측*/}
                <div className="flex gap-[30px] items-center">
                  {/* 썸네일 */}
                  <div className="w-[100px] h-[100px] rounded-2xl overflow-hidden">
                    {item.locationPic ? (
                      <img
                        src={`http://112.222.157.156:5221/pic/location/${item.locationPic}`}
                        alt={item.title}
                        ref={imgRef}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Skeleton.Image
                        active={false}
                        style={{ width: "100px", height: "100px" }}
                      />
                    )}
                  </div>
                  {/* 텍스트 */}
                  <div className="flex flex-col gap-[16px]">
                    <p className="text-[24px] text-slate-700">{item.title}</p>
                    <p className="text-[18px] text-slate-500">
                      어디론가 떠나고 싶을 때
                    </p>
                  </div>
                </div>
                {/* 좌측 */}
                <div className="h-auto flex items-center justify-center ">
                  {selectedLocationId.filter(
                    selectedItem => selectedItem.locationId === item.locationId,
                  ).length > 0 ? (
                    <button
                      type="button"
                      className="text-[16px] text-primary border border-primary3 rounded-2xl px-[15px] py-[5px]"
                      onClick={() => handleClickCancel(item)}
                    >
                      취소
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="text-[16px] text-slate-500 border border-slate-300 rounded-2xl px-[15px] py-[5px]"
                      onClick={() => handleClickSelect(item)}
                    >
                      선택
                    </button>
                  )}
                </div>
              </li>
            );
          })
        ) : (
          <li className="flex justify-between items-center">
            {/* 우측*/}
            <div className="flex gap-[30px] items-center">
              {/* 썸네일 */}
              <div className="w-[100px] h-[100px] rounded-2xl overflow-hidden">
                <Skeleton.Image
                  active={false}
                  style={{ width: "100px", height: "100px" }}
                />
              </div>
              {/* 텍스트 */}
              <div className="flex flex-col gap-[16px]">
                <p className="text-[24px] text-slate-700">지역 이름</p>
                <p className="text-[18px] text-slate-500">
                  어디론가 떠나고 싶을 때
                </p>
              </div>
            </div>
            {/* 좌측 */}
            <div className="h-auto flex items-center justify-center ">
              {selectedLocationId.filter(
                selectedItem => selectedItem.locationId === item.locationId,
              ).length > 0 ? (
                <button
                  type="button"
                  className="text-[16px] text-primary border border-primary3 rounded-2xl px-[15px] py-[5px]"
                  onClick={() => handleClickCancel(item)}
                >
                  취소
                </button>
              ) : (
                <button
                  type="button"
                  className="text-[16px] text-slate-500 border border-slate-300 rounded-2xl px-[15px] py-[5px]"
                  onClick={() => handleClickSelect(item)}
                >
                  선택
                </button>
              )}
            </div>
          </li>
        )}
      </ul>
      {/* 제출 버튼 */}
      <div className="w-full px-[32px] mb-[20px]">
        {selectedLocationId.length > 0 ? (
          <button
            type="button"
            className="w-full px-[20px] py-[15px] text-[20px] font-bold text-white bg-primary rounded-lg"
            onClick={hadleClickSubmitButton}
          >
            {selectedLocationId.length === 1
              ? `${selectedLocationId[0]?.title} 선택 완료`
              : `${selectedLocationId[0]?.title} 외 ${selectedLocationId.length - 1}개 선택 완료`}
          </button>
        ) : (
          <button
            type="button"
            className="w-full px-[20px] py-[15px] text-[20px] font-bold text-slate-400 bg-slate-50 rounded-lg"
          >
            도시 선택
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchLocation;
