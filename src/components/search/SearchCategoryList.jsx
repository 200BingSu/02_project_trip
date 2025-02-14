import React from "react";
import { categoryKor } from "../../utils/match";
import { ProductPic } from "../../constants/pic";
import { Rate } from "antd";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const SearchCategoryList = ({
  showMore = true,
  handleClickMore,
  title,
  categoryData,
}) => {
  //navigate
  const navigate = useNavigate();

  // 목록 클릭
  const handleClickList = item => {
    // setSearch({ ...search, searchWord: searchValue });
    navigate(`/contents/index?strfId=${item.strfId}`);
  };
  return (
    <div className="flex flex-col gap-[20px] items-center">
      <h2 className="w-full text-[24px] font-semibold text-slate-700">
        {title}
      </h2>
      {/* 카테고리 내 목록 */}
      <ul className="w-full flex flex-col gap-[20px] mb-[30px]">
        {categoryData?.map((item, index) => {
          return (
            <li
              className="flex gap-[20px] items-center cursor-pointer"
              key={index}
              onClick={() => {
                handleClickList(item);
              }}
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
                  <p className="text-[14px] text-slate-500">
                    {item.locationName}
                  </p>
                </div>
                {/* 별점 */}
                <div className="flex gap-[5px] items-center">
                  <Rate
                    disabled
                    count={1}
                    value={item.hasMyReview !== 0 ? 1 : 0}
                  />
                  <p className="text-[12px] text-slate-500">
                    {item.averageRating ? item.averageRating : "0"}
                  </p>
                  <p className="text-[12px] text-slate-500">
                    ({item.reviewCount.toLocaleString()})
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
                    {item.wishlistCount.toLocaleString()}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {/* 버튼 */}
      {showMore && (
        <button
          type="button"
          className="px-[20px] py-[10px] border border-slate-300 

        rounded-[24px] text-[16px] font-semibold text-slate-600"
          onClick={handleClickMore}
        >
          {title} 검색결과 더보기
        </button>
      )}
    </div>
  );
};

export default SearchCategoryList;
