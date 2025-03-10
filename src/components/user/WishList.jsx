import { Button, Rate } from "antd";
import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import jwtAxios from "../../apis/jwt";
import SearchFilter from "../basic/SearchFilter";
import { ProductPic } from "../../constants/pic";

const WishList = ({ category }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [wishListData, setWishListData] = useState([]);
  const [isMore, setIsMore] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [orderType, setOrderType] = useState("ratingAvg");
  const navigate = useNavigate();

  //찜하기 취소
  const postWishItem = async item => {
    const sendData = {
      strfId: item.strfId,
    };
    try {
      const res = await jwtAxios.post(`/api/wish-list`, { ...sendData });
      setStartIndex(0);
      await getWishList(0); // startIndex를 0으로 설정하여 데이터 불러오기
    } catch (error) {
      console.log("error", error);
    }
  };

  // 찜하기 가져오기
  const getWishList = async (index = startIndex) => {
    try {
      const res = await jwtAxios.get(
        `/api/wish-list?start_idx=${index}&orderType=${orderType}&category=${category}`,
      );

      setWishListData(prev => {
        if (index === 0) {
          return res.data.data; // 데이터 초기화
        } else {
          return [...prev, ...res.data.data]; // 데이터 추가
        }
      });

      if (res.data.data) {
        setStartIndex(index + 10); // 이전 값을 기반으로 증가
      }
    } catch (error) {
      console.log("찜목록 불러오기 실패", error);
    }
  };

  // 🔹 category, orderType 변경 시 데이터 초기화 후 새로 불러오기
  useEffect(() => {
    setStartIndex(0); // category나 orderType이 변경될 때마다 startIndex 초기화
    getWishList(); // 데이터 초기화 후 새로 불러오기
  }, [category, orderType]);

  // 🔹 더보기 버튼 클릭 시 데이터 추가
  const handleLoadMore = () => {
    getWishList(startIndex); // 현재 startIndex 값을 명시적으로 전달
    console.log("Current startIndex:", startIndex);
  };

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
        <p className="text-sm font-semibold text-slate-700">
          총 {wishListData.length}개
        </p>
        <button
          className="flex items-center gap-1 text-slate-500"
          onClick={() => setShowFilter(true)}
        >
          {orderTypeText[orderType]} <IoIosArrowDown />
        </button>
      </div>
      <div className="px-4 py-6">
        <ul className="w-full flex flex-col gap-3 mb-[30px]">
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
                    src={`${ProductPic}/${item.strfId}/${item.strfPic}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <AiFillHeart
                    className="text-secondary3 text-xl absolute top-2 right-2"
                    onClick={e => {
                      e.stopPropagation();
                      postWishItem(item);
                      setStartIndex(0); // startIndex 초기화
                      setWishListData([]); // 데이터 초기화
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
            onClick={handleLoadMore}
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
