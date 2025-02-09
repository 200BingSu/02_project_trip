import { useNavigate } from "react-router-dom";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { Button, Rate } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "../../utils/cookie";
import { ProductPic } from "../../constants/pic";

import { AiFillHeart, AiTwotoneHeart } from "react-icons/ai";
import { categoryKor } from "../../utils/match";

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
  const [lastIndex, setLastIndex] = useState(1);
  const [wishListData, setWishListData] = useState([]);
  useEffect(() => {
    console.log("wishListData", wishListData);
  }, [wishListData]);
  // 찜 목록
  const getWishList = async () => {
    try {
      const res = await axios.get(`/api/wish-list?start_idx=${lastIndex}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      //   console.log(res.data);
      const resultData = res.data;
      setWishListData([...wishListData, ...resultData.data]);
      setLastIndex(prev => prev + 10);
    } catch (error) {
      console.log("찜목록 불러오기", error);
    }
  };
  useEffect(() => {
    getWishList();
  }, []);
  return (
    <div>
      <TitleHeader icon="back" onClick={navigateBack} title="찜 목록" />
      <div className="px-[32px] flex flex-col gap-[50px] mt-[60px] ">
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
                    <Rate disabled count={1} value={item.ratingIn ? 1 : 0} />
                    <p className="text-[12px] text-slate-500">
                      {item.averageRating ? item.averageRating : "0"}
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
    </div>
  );
};
export default UserWishList;
