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
import { LocationPic } from "../../constants/pic";
import { useRecoilState } from "recoil";
import { editTripAtom } from "../../atoms/EditTripAtom";

const SearchLocation = () => {
  //recoil
  const [editData, setEditData] = useRecoilState(editTripAtom);
  useEffect(() => {
    console.log("편집 데이터", editData);
  }, [editData]);
  //useNavigate
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state;
  const fromPage = locationState?.from;
  // useLocation
  const tripLocationList = locationState?.tripLocationList;
  // 일정 관리 안 넣었음
  const handleClickSubmitButton = () => {
    if (fromPage) {
      if (fromPage === "/schedule/index") {
        navigate(fromPage);
        setEditData({
          ...editData,
          tripLocationList: selectedLocationId,
        });
      } else {
        navigate(fromPage, { state: selectedLocationId });
      }
    } else {
      navigate(`/schedule/days`, {
        state: {
          selectedLocationId: selectedLocationId,
          title: selectedLocationId[0].title,
        },
      });
    }
  };

  // useState
  const [locationData, setLocationData] = useState(null);
  const [selectedLocationId, setSelectedLocationId] = useState([]);
  const [searchState, setSearchState] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("selectedLocationId", selectedLocationId);
  }, [selectedLocationId]);
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
      // console.log("지역 목록 조회:", res.data);
      setLocationData(res.data);
    } catch (error) {
      console.log("지역 목록 조회:", error);
    }
  };
  useEffect(() => {
    getLocationList();
  }, []);

  useEffect(() => {
    if (locationData && editData?.tripLocationList) {
      const matchedLocations = locationData.data.locationList.filter(location =>
        editData.tripLocationList.includes(location.locationId),
      );
      setSelectedLocationId(matchedLocations);
    }
  }, [locationData, editData?.tripLocationList]);

  const locationArr = locationData?.data.locationList;
  const sortArr = locationArr?.filter(item => item.title.includes(searchValue));

  // 지역 선택
  const handleClickSelect = item => {
    // 중복 선택 방지를 위한 체크 추가
    if (!selectedLocationId.some(loc => loc.locationId === item.locationId)) {
      setSelectedLocationId([...selectedLocationId, item]);
    }
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
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
      {/* 지역 목록 */}
      <ul className="flex flex-col gap-[20px] px-[32px] mb-[20px]">
        {sortArr?.length > 0
          ? sortArr?.map(item => {
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
                          src={`${LocationPic}${item.locationPic}`}
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
                      selectedItem =>
                        selectedItem.locationId === item.locationId,
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
          : null}
      </ul>
      {/* 제출 버튼 */}
      <div className="w-full px-[32px] mb-[20px]">
        {selectedLocationId.length > 0 ? (
          <button
            type="button"
            className="w-full px-[20px] py-[15px] text-[20px] font-bold text-white bg-primary rounded-lg"
            onClick={handleClickSubmitButton}
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
