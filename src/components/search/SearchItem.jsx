import React from "react";
import { useNavigate } from "react-router-dom";
import { ProductPic } from "../../constants/pic";
import { categoryKor } from "../../utils/match";
import { Rate } from "antd";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useRecoilState, useSetRecoilState } from "recoil";
import { searchAtom } from "../../atoms/searchAtom";

const SearchItem = ({ item, onClick }) => {
  // router
  const navigate = useNavigate();
  // recoil
  const [searchRecoil, setSearchRecoil] = useRecoilState(searchAtom);

  // 검색 아이템 클릭
  const handleClickItem = item => {
    console.log("아이템 클릭");
    setSearchRecoil(prev => ({
      ...prev,
      fromContent: true,
    }));
    navigate(`/contents/index?strfId=${item.strfId}`);
  };
  return (
    <div
      className="flex gap-[20px] items-center cursor-pointer"
      onClick={() => handleClickItem(item)}
    >
      {/* 썸네일 */}
      <div className="w-[130px] h-[130px] bg-slate-200 rounded-[8px] overflow-hidden select-none">
        <img
          src={`${ProductPic}/${item.strfId}/${item.strfPic}`}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>
      {/* 정보 */}
      <div className="flex flex-col gap-[5px]">
        {/* 제목, 지역 제휴 */}
        <div className="flex gap-[5px] items-center ">
          <h3 className="text-[20px] font-semibold text-slate-700 select-none">
            {item.title || item.strfTitle}
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
          <p className="text-[14px] text-slate-500">{item.locationName}</p>
        </div>
        {/* 별점 */}
        <div className="flex gap-[5px] items-center">
          <Rate disabled count={1} value={item.hasMyReview !== 0 ? 1 : 0} />
          <p className="text-[12px] text-slate-500">
            {item.averageRating ? item.averageRating : "0"}
          </p>
          <p className="text-[12px] text-slate-500">
            (
            {item.reviewCount
              ? item.reviewCount?.toLocaleString()
              : item.reviewCnt?.toLocaleString()}
            )
          </p>
        </div>
        {/* 찜하기 */}
        <div className="flex gap-[5px] items-center">
          <div>
            {item.wishIn ? (
              <AiFillHeart className="text-secondary3" />
            ) : (
              <AiOutlineHeart className="text-slate-400" />
            )}
          </div>
          <p className="text-[12px] text-slate-500">
            {item.wishlistCount?.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
