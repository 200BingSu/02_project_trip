import React from "react";
import { Outlet } from "react-router-dom";
import TitleHeader from "../../../components/layout/header/TitleHeader";

const SearchIndex = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default SearchIndex;
