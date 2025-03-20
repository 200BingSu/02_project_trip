import { useNavigate } from "react-router-dom";
import { ProductPic } from "../../constants/pic";
import { IStrfItem } from "../../pages/userpage/search/SearchInTrip";
import { Rate } from "antd";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { categoryKor } from "../../utils/match";

interface SearchTripItemProps {
  item: IStrfItem;
}

const SearchTripItem = ({ item }: SearchTripItemProps) => {
  const navigate = useNavigate();
  const navigateContent = (strfId: number) => {
    console.log(strfId);
    navigate(`/contents/index?strfId=${strfId}`);
  };
  return (
    <li
      className="flex gap-5 items-center cursor-pointer"
      onClick={() => {
        navigateContent(item.strfId);
      }}
    >
      {/* 썸네일 */}
      <div className="w-32 aspect-square bg-slate-200 rounded-lg overflow-hidden">
        <img
          src={`${ProductPic}/${item.strfId}/${item.picTitle}`}
          alt={item.title}
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
        </div>
        {/* 카테고리, 지역 */}
        <div className="flex gap-[5px] items-center">
          <p className="text-[14px] text-slate-500">
            {categoryKor(item.category)}
          </p>
        </div>
        {/* 별점 */}
        <div className="flex gap-[5px] items-center">
          <Rate
            disabled
            count={1}
            value={item.ratingIn ? 1 : 0}
            style={{ fontSize: "16px" }}
          />
          <p className="text-[12px] text-slate-500">{item.avgRating}</p>
          <p className="text-[12px] text-slate-500">
            ({item.ratingCnt.toLocaleString()})
          </p>
        </div>
        {/* 찜하기 */}
        <div className="flex gap-[5px] items-center">
          <div>
            {item.wishIn ? (
              <AiFillHeart className="text-secondary3 text-[16px]" />
            ) : (
              <AiOutlineHeart className="text-slate-400 text-[16px]" />
            )}
          </div>
          <p className="text-[12px] text-slate-500">
            {item.wishCnt.toLocaleString()}
          </p>
        </div>
      </div>
    </li>
  );
};

export default SearchTripItem;
