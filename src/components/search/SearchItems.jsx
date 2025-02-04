import { Rate, Skeleton } from "antd";
import React, { forwardRef, memo, useEffect, useState } from "react";
import { AiTwotoneHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { SEARCH } from "../../constants/api";
import axios from "axios";

const SearchItems = forwardRef(({ type, data, searchValue }, ref) => {
  //useNavigate
  const navigate = useNavigate();
  const handleClickList = item => {
    console.log("클릭된 아이템", item);
    navigate(`/contents?strfId=${item.strfId}`);
  };
  // useState
  const [dataIndex, setDataIndex] = useState(4);
  useEffect(() => {
    console.log(dataIndex);
  }, [dataIndex]);
  // 더보기 api
  const getSearchListMore = async data => {
    try {
      const res = await axios.get(`${SEARCH.searchList}`);
      console.log("더보기 결과:", res.data);
    } catch (error) {
      console.log("더보기 에러:", error);
    }
  };
  // 더보기 버튼 클릭
  const handleClickButton = () => {
    const sendData = {
      category: type,
      search_word: searchValue,
      last_index: dataIndex,
    };
    console.log("더보기 sendData:", sendData);
    getSearchListMore(sendData);
    setDataIndex(prev => prev + 4);
  };

  const itemsArr = data?.list;

  return (
    <div ref={ref} className="flex flex-col gap-[20px] items-center">
      <h2 className="w-full text-[24px] font-semibold text-slate-700">
        {type}
      </h2>
      <ul className="w-full flex flex-col gap-[20px] mb-[30px]">
        {data ? (
          itemsArr.map(item => {
            return (
              <li
                className="flex gap-[20px] items-center"
                key={item.strfId}
                onClick={() => {
                  handleClickList();
                }}
              >
                {/* 썸네일 */}
                <div className="w-[130px] h-[130px] bg-slate-200 rounded-[8px]">
                  <img
                    src={item.picTitle}
                    alt="thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* 정보 */}
                <div className="flex flex-col gap-[5px]">
                  {/* 제목, 지역 제휴 */}
                  <div className="flex gap-[5px] items-center ">
                    <h3 className="text-[20px] font-semibold text-slate-700">
                      {item.title}
                    </h3>
                    {/* <div className="h-[14px] px-[5px] py-[3px] bg-[#FDB4A1] bg-opacity-50 text-secondary3_3 text-[8px] font-semibold flex items-center justify-center line-height-[100%]">
                      지역 제휴
                    </div> */}
                  </div>
                  {/* 카테고리, 지역 */}
                  <div className="flex gap-[5px] items-center">
                    <p className="text-[14px] text-slate-500">
                      {data.category}
                    </p>
                    <p className="text-[14px] text-slate-500">|</p>
                    <p className="text-[14px] text-slate-500">지역</p>
                  </div>
                  {/* 별점 */}
                  <div className="flex gap-[5px] items-center">
                    <Rate disabled count={1} value={item.ratingIn ? 1 : 0} />
                    <p className="text-[12px] text-slate-500">
                      {item.averageRating}
                    </p>
                    <p className="text-[12px] text-slate-500">
                      ({item.ratingCnt.toLocaleString()})
                    </p>
                  </div>
                  {/* 찜하기 */}
                  <div className="flex gap-[5px] items-center">
                    <div>
                      <AiTwotoneHeart
                        className={`${item.wishIn ? "text-color-secondary3" : "text-slate-400"}`}
                      />
                    </div>
                    <p className="text-[12px] text-slate-500">
                      {item.wishCnt.toLocaleString()}
                    </p>
                  </div>
                </div>
              </li>
            );
          })
        ) : (
          <li
            className="flex gap-[20px] items-center cursor-pointer"
            onClick={handleClickList}
          >
            {/* 썸네일 */}
            <div className="w-[130px] h-[130px] bg-slate-200 rounded-[8px]">
              <Skeleton.Image
                active={false}
                size="large"
                style={{ width: "130px", height: "130px" }}
              />
            </div>
            {/* 정보 */}
            <div className="flex flex-col gap-[5px]">
              {/* 제목, 지역 제휴 */}
              <div className="flex gap-[5px] items-center ">
                <h3 className="text-[20px] font-semibold text-slate-700">
                  제목
                </h3>
                {/* <div className="h-[14px] px-[5px] py-[3px] bg-[#FDB4A1] bg-opacity-50 text-secondary3_3 text-[8px] font-semibold flex items-center justify-center line-height-[100%]">
                  지역 제휴
                </div> */}
              </div>
              {/* 카테고리, 지역 */}
              <div className="flex gap-[5px] items-center">
                <p className="text-[14px] text-slate-500">카테고리</p>
                <p className="text-[14px] text-slate-500">|</p>
                <p className="text-[14px] text-slate-500">지역</p>
              </div>
              {/* 별점 */}
              <div className="flex gap-[5px] items-center">
                <Rate disabled count={1} value={0} />
                {/*value 값 넣고 review 유무에 따라 0,1  */}
                <p className="text-[12px] text-slate-500">평점</p>
                <p className="text-[12px] text-slate-500">
                  ({(1000).toLocaleString()})
                </p>
              </div>
              {/* 찜하기 */}
              <div className="flex gap-[5px] items-center">
                <div>
                  <AiTwotoneHeart className="text-slate-400 bg-white" />
                </div>
                <p className="text-[12px] text-slate-500">
                  {(1000).toLocaleString()}
                </p>
              </div>
            </div>
          </li>
        )}
      </ul>
      {/* 더보기 */}
      <button
        type="button"
        className="px-[20px] py-[10px] border border-slate-300 
        rounded-[24px] text-[16px] font-semibold text-slate-600"
        onClick={handleClickButton}
      >
        {type} 검색결과 더보기
      </button>
    </div>
  );
});

export default memo(SearchItems);
