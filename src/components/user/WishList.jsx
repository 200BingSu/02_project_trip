import { Button, Rate } from "antd";
import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import jwtAxios from "../../apis/jwt";
import { ProductPic } from "../../constants/pic";
import SearchFilter from "../basic/SearchFilter";

const WishList = ({ category }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [wishListData, setWishListData] = useState([]);
  const [isMore, setIsMore] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [orderType, setOrderType] = useState("ratingAvg");
  const navigate = useNavigate();

  const getWishList = async () => {
    try {
      const res = await jwtAxios.get(
        `/api/wish-list?start_idx=${startIndex}&orderType=${orderType}&category=${category}`,
      );
      console.log(res.data);
      const resultData = res.data;
      setWishListData(prev =>
        startIndex === 0 ? resultData.data : [...prev, ...resultData.data],
      );
      setIsMore(resultData.more);
    } catch (error) {
      console.log("찜목록 불러오기 실패", error);
    }
  };

  const postWishItem = async item => {
    const sendData = {
      strfId: item.strfId,
    };
    console.log("찜하기 데이터:", sendData);
    try {
      const res = await jwtAxios.post(`/api/wish-list`, { ...sendData });
      console.log("찜하기", res.data);
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        setStartIndex(0); // startIndex를 0으로 강제 초기화
        getWishList(0); // 기존 데이터 초기화 후 다시 불러오기
      }
    } catch (error) {
      console.log("찜하기", error);
    }
  };

  // 🔹 카테고리 & 정렬 변경 시 기존 데이터 초기화 및 startIndex 0으로 설정
  useEffect(() => {
    setWishListData([]); // 기존 데이터 초기화
    setStartIndex(0); // startIndex 초기화
    getWishList(0); // 초기화된 startIndex로 호출
  }, [category, orderType]); // category, orderType 변경 시 실행

  // 🔹 startIndex가 변경될 때 API 호출
  useEffect(() => {
    getWishList();
  }, [startIndex]); // startIndex 변경될 때 실행

  const categoryArr = {
    TOUR: "관광지",
    FEST: "축제",
    STAY: "숙소",
    RESTAUR: "맛집",
  };

  const orderTypeText = {
    ratingAvg: "평점순",
    ratingCnt: "리뷰순",
    likeCnt: "좋아요순",
  };

  return (
    <div>
      {showFilter && (
        <SearchFilter
          setShowFilter={setShowFilter}
          setOrderType={setOrderType}
        />
      )}
      <div className="flex justify-between py-[14px] px-4 border-b-[1px] border-slate-100 ">
        <p className="text-sm font-semibold">총 {wishListData.length}개</p>
        <button
          className="flex items-center gap-1 text-slate-500"
          onClick={() => setShowFilter(true)}
        >
          {orderTypeText[orderType]} <IoIosArrowDown />
        </button>
      </div>
      <div className="px-4 py-6">
        <ul className="w-full flex flex-col gap-[20px] mb-[30px]">
          {wishListData.map((item, index) => {
            return (
              <li
                className="flex gap-[20px] items-center cursor-pointer"
                key={index}
                onClick={() =>
                  navigate(`/contents/index?strfId=${item.strfId}`)
                }
              >
                {/* 썸네일 */}
                <div className="w-32 min-w-32 aspect-square bg-slate-200 rounded-lg overflow-hidden relative">
                  <img
                    src={`${ProductPic}${item.strfId}/${item.strfPic}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <AiFillHeart
                    className="text-secondary3 text-xl absolute top-2 right-2"
                    onClick={e => {
                      e.stopPropagation();
                      postWishItem(item);
                    }}
                  />
                </div>
                {/* 정보 */}
                <div className="flex flex-col gap-[5px]">
                  {/* 제목, 지역 제휴 */}
                  <div className="flex gap-[5px] items-center ">
                    <h3 className="text-lg font-medium text-slate-700">
                      {item.strfTitle}
                    </h3>
                  </div>
                  {/* 카테고리, 지역 */}
                  <div>
                    <p className="text-sm text-slate-500">
                      {categoryArr[item.category] || item.category} ·{" "}
                      {item.locationName}
                    </p>
                  </div>
                  {/* 별점 */}
                  <div className="flex gap-1 items-center">
                    <Rate
                      disabled
                      allowHalf
                      value={item.ratingAvg}
                      className="flex items-center custom-star-wish custom-star"
                    />
                    <p className="text-sm text-slate-500">
                      ({item.ratingCnt.toLocaleString()})
                    </p>
                  </div>
                  {/* 찜하기 */}
                  <div className="flex gap-1 items-center text-sm">
                    <AiOutlineHeart className="text-slate-400 text-lg" />
                    <p className="text-slate-500">
                      {item.wishCnt.toLocaleString()}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="px-[32px] pb-[40px] flex items-center justify-center">
          <Button
            variant="outlined"
            onClick={() => setStartIndex(prev => prev + 10)}
            className="text-slate-500 text-base !h-auto py-2 px-5 border-1 border-slate-200 rounded-full"
          >
            더보기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WishList;
