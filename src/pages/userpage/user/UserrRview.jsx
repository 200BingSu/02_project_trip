import { Button, Rate } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { AiFillStar, AiOutlinePlus } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

import { ReviewPic } from "../../../constants/pic";
import "../../../styles/antd-styles.css";
import { getCookie } from "../../../utils/cookie";
import { RiCloseLargeFill } from "react-icons/ri";
import jwtAxios from "../../../apis/jwt";
import { CgMoreVerticalAlt } from "react-icons/cg";
import BottomSheet from "../../../components/basic/BottomSheet";
import { BiSolidEditAlt, BiTrash } from "react-icons/bi";
import TitleHeader from "../../../components/layout/header/TitleHeader";
import DynamicGrid from "../../../components/basic/DynamicGrid";

const UserrRview = () => {
  const [reviewInfo, setReviewInfo] = useState([]);
  const [isCount, setIsCount] = useState(0);
  const [startIndex, setStartIndex] = useState(0); // startIndex 상태 추가
  const [isShowMore, setIsShowMore] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // 선택된 아이템 상태 추가
  const accessToken = getCookie("accessToken");

  // 사용자 리뷰를 더 가져오기
  const getUserReview = async () => {
    try {
      const res = await jwtAxios.get(`/api/review/my?start_idx=${startIndex}`);

      setReviewInfo(prev => [...prev, ...res.data.data.dtoList]); // 기존 리뷰에 새 리뷰 추가
      if (res.data.data.dtoList) {
        setStartIndex(prev => prev + 10);
      }
      // if (res.data[0].more === false) {
      //   setIsShowMore(false);
      // }
      console.log("✅  getUserReview  res.data.data:", res.data.data.dtoList);
    } catch (error) {
      console.log("✅  getUserReview  error:", error);
    }
  };

  const reviewCount = async () => {
    try {
      const res = await jwtAxios.get(`/api/review/count`);
      console.log("✅  reviewCount  res:", res.data); // 여기에 출력된 값은 숫자일 것입니다.
      setIsCount(res.data); // res.data가 바로 숫자이므로 바로 사용
    } catch (error) {
      console.log("✅  reviewCount  error:", error);
    }
  };

  console.log(" reviewInfo", reviewInfo);
  // 리뷰 삭제하기
  const deleteReview = async item => {
    console.log(item);

    try {
      await jwtAxios.delete(`/api/review/del?review_id=${item.reviewId}`);
      setStartIndex(0); // startIndex를 먼저 업데이트
      setReviewInfo([]); // 기존 리뷰 초기화
      console.log("리뷰 삭제:", res.data);
    } catch (error) {
      console.log("리뷰 삭제:", error);
    }
  };

  useEffect(() => {
    if (reviewInfo.length === 0) {
      getUserReview();
    }
  }, [startIndex]);

  useEffect(() => {
    reviewCount();
  }, []);

  const handleLoadMore = () => {
    getUserReview();
  };

  const navigate = useNavigate();

  const actions = item => [
    {
      label: (
        <div className="flex items-center gap-3 text-lg">
          <BiTrash className="text-slate-400" />
          삭제하기
        </div>
      ),
      onClick: () => {
        deleteReview(item);
        setIsOpen(false);
      },
    },
  ];

  return (
    <div>
      <TitleHeader icon="back" title="리뷰" onClick={() => navigate(-2)} />
      <div className="flex justify-between py-[14px] px-4 border-b-[1px] border-t-[1px] border-slate-100 ">
        <p className="text-sm font-semibold">총 {isCount}개</p>
      </div>
      <div>
        {reviewInfo.map((item, index) => {
          return (
            <div
              key={index}
              className="py-8 px-4 border-b-[10px] border-slate-100 last:border-none"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h1
                    className="flex items-center gap-2 h text-lg font-semibold text-slate-700 mb-2 cursor-pointer"
                    onClick={() =>
                      navigate(`/contents/index?strfId=${item.strfId}`)
                    }
                  >
                    {item.strfTitle}
                    <IoIosArrowForward />
                  </h1>
                </div>
                <CgMoreVerticalAlt
                  className="text-slate-400 text-2xl cursor-pointer"
                  onClick={e => {
                    setIsOpen(true);
                    setSelectedItem(item); // 선택된 아이템 설정
                  }}
                />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <Rate
                  className="custom-rate flex items-center gap-[2px]"
                  disabled
                  allowHalf
                  defaultValue={item.rating}
                />
                <p className="text-slate-400 text-base">
                  {item.reviewWriteDate.split(" ")[0].replace(/-/g, ".")}
                </p>
              </div>
              <p className="text-base text-slate-700 mb-2">{item.content}</p>
              {item.myReviewPic && item.myReviewPic.length > 0 && (
                <DynamicGrid reviewPics={item} type="myReview" />
              )}
            </div>
          );
        })}
      </div>
      {isShowMore && (
        <div className="flex justify-center py-[14px]">
          <Button
            className="text-slate-500 text-base !h-auto py-2 px-5 border-1 border-slate-200 rounded-full"
            onClick={() => handleLoadMore()}
          >
            더보기
          </Button>
        </div>
      )}
      <BottomSheet
        open={isOpen}
        onClose={() => setIsOpen(false)}
        actions={selectedItem ? actions(selectedItem) : []} // 선택된 아이템을 actions에 전달
      />
    </div>
  );
};
export default UserrRview;
