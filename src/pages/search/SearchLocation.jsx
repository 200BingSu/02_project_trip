import { Input } from "antd";
import React, { useState } from "react";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import SearchBar from "../../components/search/SearchBar";
import SearchNone from "../../components/search/SearchNone";
import SearchList from "../../components/search/SearchList";

const SearchLocation = () => {
  //useNavigate
  const navigate = useNavigate();
  // useState
  const [searchState, setSearchState] = useState(false);

  return <div>지역 목록 검색</div>;
};

export default SearchLocation;
