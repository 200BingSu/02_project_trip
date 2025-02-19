import { useNavigate } from "react-router-dom";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { Button, Rate } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "../../utils/cookie";
import { ProductPic } from "../../constants/pic";

import { AiFillHeart, AiTwotoneHeart } from "react-icons/ai";
import { categoryKor } from "../../utils/match";
import { categoryArr, orderTypeArr } from "../../constants/search";
import jwtAxios from "../../apis/jwt";
import dayjs from "dayjs";

const UserWishList = () => {
  const accessToken = getCookie("accessToken");
  //useNavigate
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate(-1);
  };
  const navigateContent = item => {
    navigate(`/contents/index?strfId=${item.strfId}`);
  };
  //useState
  const [startIndex, setStartIndex] = useState(0);
  const [wishListData, setWishListData] = useState([]);
  const [category, setCategory] = useState(0);
  const [orderType, setOrderType] = useState(0);
  const [isMore, setIsMore] = useState(true);
  useEffect(() => {
    console.log("wishListData", wishListData);
  }, [wishListData]);
  // 찜 목록
  const getWishList = async () => {
    try {
      const res = await jwtAxios.get(
        `/api/wish-list?start_idx=${startIndex}&orderType=${orderTypeArr[orderType].type}&category=${categoryArr[category].name}`,
      );
      console.log(res.data);
      const resultData = res.data;
      setWishListData([...wishListData, ...resultData.data]);
      setStartIndex(prev => prev + 10);
    } catch (error) {
      console.log("찜목록 불러오기", error);
    }
  };
  const getWishListFest = async () => {
    const today = dayjs().format("YYYY-MM-DD");
    try {
      const res = await jwtAxios.get(
        `/api/wish-list/fest?start_idx=${startIndex}&orderType=${orderTypeArr[orderType].type}&category=${categoryArr[category].name}&start_at=${today}`,
      );
      console.log(res.data);
      const resultData = res.data;
      setWishListData([...wishListData, ...resultData.data]);
      setStartIndex(prev => prev + 10);
      if (resultData.data[0].more === false) {
        setIsMore(false);
      }
    } catch (error) {
      console.log("찜목록 불러오기", error);
    }
  };
  // 카테고리 변경
  const handleCategoryChange = index => {
    setCategory(index);
    setStartIndex(0);
    setWishListData([]);
  };
  // 정렬 변경
  const handleOrderTypeChange = index => {
    setOrderType(index);
    setStartIndex(0);
    setWishListData([]);
  };
  useEffect(() => {
    getWishList();
  }, []);
  useEffect(() => {
    if (category !== 4) {
      getWishList();
    } else {
      getWishListFest();
    }
  }, [category, orderType]);
  return (
    <div>
      <TitleHeader icon="back" onClick={navigateBack} title="찜 목록" />
      <div className="px-[32px] flex flex-col gap-[50px] mt-[30px] ">
        {/* 필터 */}
        <div className="flex flex-col gap-[20px]">
          {/* 카테고리 */}
          <ul className="flex justify-between items-center">
            {categoryArr.map((item, index) => {
              return (
                <li
                  key={index}
                  onClick={() => {
                    handleCategoryChange(index);
                  }}
                  className={`cursor-pointer font-semibold text-[16px] w-full flex justify-center items-center px-[15px] py-[10px] gap-[10px] rounded-[8px] ${
                    index === category
                      ? "bg-primary text-white"
                      : "bg-white text-slate-500"
                  }`}
                >
                  {item.name}
                </li>
              );
            })}
          </ul>

          {/* 정렬 */}
          <ul className="flex items-center">
            {orderTypeArr.map((item, index) => {
              return (
                <li
                  key={index}
                  className={`cursor-pointer font-semibold text-[13px] flex items-center px-3 py-1  ${
                    index === orderType ? "text-primary" : "text-slate-500"
                  }`}
                  onClick={() => handleOrderTypeChange(index)}
                >
                  {item.name}
                </li>
              );
            })}
          </ul>
        </div>
        {/* 검색 목록 */}
        <ul className="w-full flex flex-col gap-[20px] mb-[30px]">
          {wishListData.map((item, index) => {
            return (
              <li
                className="flex gap-[20px] items-center cursor-pointer"
                key={index}
                onClick={() => navigateContent(item)}
              >
                {/* 썸네일 */}
                <div className="w-[130px] h-[130px] bg-slate-200 rounded-[8px] overflow-hidden">
                  <img
                    src={`${ProductPic}${item.strfId}/${item.strfPic}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* 정보 */}
                <div className="flex flex-col gap-[5px]">
                  {/* 제목, 지역 제휴 */}
                  <div className="flex gap-[5px] items-center ">
                    <h3 className="text-[20px] font-semibold text-slate-700">
                      {item.strfTitle}
                    </h3>
                    {/* <div className="h-[14px] px-[5px] py-[3px] bg-[#FDB4A1] bg-opacity-50 text-secondary3_3 text-[8px] font-semibold flex items-center justify-center line-height-[100%]">
                      지역 제휴
                    </div> */}
                  </div>
                  {/* 카테고리, 지역 */}
                  <div className="flex gap-[5px] items-center">
                    <p className="text-[14px] text-slate-500">
                      {categoryKor(item.category)}
                    </p>
                    <p className="text-[14px] text-slate-500">|</p>
                    <p className="text-[14px] text-slate-500">
                      {item.locationName}
                    </p>
                  </div>
                  {/* 별점 */}
                  <div className="flex gap-[5px] items-center">
                    <Rate
                      disabled
                      count={1}
                      value={item.reviewed ? 1 : 0}
                      className="text-primary"
                    />
                    <p className="text-[12px] text-slate-500">
                      {item.ratingAvg !== 0 ? item.ratingAvg : "0"}
                    </p>
                    <p className="text-[12px] text-slate-500">
                      ({item.ratingCnt.toLocaleString()})
                    </p>
                  </div>
                  {/* 찜하기 */}
                  <div className="flex gap-[5px] items-center">
                    <div>
                      <AiFillHeart className="text-secondary3" />
                    </div>
                    <p className="text-[12px] text-slate-500">
                      {item.wishCnt.toLocaleString()}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      {isMore && (
        <div className="px-[32px] pb-[40px] flex items-center justify-center">
          <Button
            variant="outlined"
            onClick={() => {
              getWishList();
            }}
            className="h-[46px] px-[20px] py-[10px] rounded-3xl text-slate-600 text-[16px] font-semibold"
          >
            더보기
          </Button>
        </div>
      )}
    </div>
  );
};
export default UserWishList;
