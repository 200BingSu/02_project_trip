import { Rate, Skeleton } from "antd";
import React, { forwardRef, memo, useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart, AiTwotoneHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { SEARCH } from "../../constants/api";
import axios from "axios";
import { ProductPic } from "../../constants/pic";
import { getCookie } from "../../utils/cookie";
import { categoryKor } from "../../utils/match";
import { searchAtom } from "../../atoms/searchAtom";
import { useRecoilState } from "recoil";

const SearchItems = forwardRef(
  (
    {
      key,
      type,
      name,
      data,
      searchValue,
      searchData,
      setSearchData,
      setSelectedCate,
      category,
      dataIndex,
      setDataIndex,
    },
    ref,
  ) => {
    // console.log("현재 data로 들어오는 내용:", data);

    // 쿠키
    const accessToken = getCookie("accessToken");
    //recoil
    const [search, setSearch] = useRecoilState(searchAtom);
    //useNavigate
    const navigate = useNavigate();

    const handleClickList = item => {
      // console.log("클릭된 아이템", item);
      setSearch({ ...search, searchWord: searchValue });
      navigate(`/contents/index?strfId=${item.strfId}`, {
        state: { searchValue: searchValue },
      });
    };

    // useState

    const [showMore, setShowMore] = useState(true);
    useEffect(() => {
      // console.log(dataIndex);
    }, [dataIndex]);

    // 카테고리 별 더보기
    const getSearchListMore = async data => {
      try {
        const res = await axios.get(
          `/api/search/category?last_index=${dataIndex}&category=${categoryKor(data)}&search_word=${searchValue}&order_type=ratingAvg`,
        );
        console.log("더보기 결과:", res.data);
        if (res.data.data.length === 0) {
          setShowMore(false);
        }
        const resultData = res.data;
        setSearchData([...searchData, ...resultData.data]);
        setDataIndex(prev => prev + 10);
      } catch (error) {
        console.log("더보기 에러:", error);
      }
    };
    // 더보기 버튼 클릭
    const handleClickButton = () => {
      console.log(type, category);
      setSelectedCate(category);
      // if (type === "all") {
      //   moveTo();
      // }
      getSearchListMore(type);
    };

    return (
      <div ref={ref} className="flex flex-col gap-[20px] items-center">
        <h2 className="w-full text-[24px] font-semibold text-slate-700">
          {name}
        </h2>
        <ul className="w-full flex flex-col gap-[20px] mb-[30px]">
          {data ? (
            data.map((item, index) => {
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
                      <Rate disabled count={1} value={item.ratingIn ? 1 : 0} />
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
        {showMore && (
          <button
            type="button"
            className="px-[20px] py-[10px] border border-slate-300 

        rounded-[24px] text-[16px] font-semibold text-slate-600"
            onClick={() => handleClickButton(type)}
          >
            {categoryKor(type)} 검색결과 더보기
          </button>
        )}
      </div>
    );
  },
);

export default memo(SearchItems);
