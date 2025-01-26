import { Button, Checkbox, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import SearchBar from "../../components/search/SearchBar";
import SearchNone from "../../components/search/SearchNone";
import SearchList from "../../components/search/SearchList";
import { TRIP } from "../../constants/api";

// 임시 지역 목록
const locationArr = [
  {
    locationId: 1,
    locationPic: "location.png",
    title: "가평",
  },
  {
    locationId: 2,
    locationPic: "location.png",
    title: "강릉",
  },
  {
    locationId: 3,
    locationPic: "location.png",
    title: "경주",
  },
];
const SearchLocation = () => {
  //useNavigate
  const navigate = useNavigate();
  // useState
  const [locationData, setLocationData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState([]);

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
  // 지역 선택
  const handleLocationClick = item => {
    setSelectedLocation([...selectedLocation, item]);
  };
  useEffect(() => {
    console.log("selectedLocation", selectedLocation);
  }, [selectedLocation]);
  return (
    <div>
      {/* 검색바 */}
      <SearchBar />
      {/* 지역 목록 */}
      <ul>
        {locationArr.map((item, index) => {
          return (
            <li>
              {item.title}{" "}
              <Button type="button" onClick={() => handleLocationClick(item)}>
                선택
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SearchLocation;
