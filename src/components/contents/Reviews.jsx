import { Avatar, Button, Rate, Skeleton } from "antd";
import React, { memo, useCallback, useEffect, useState } from "react";
import { LiaComment } from "react-icons/lia";
import ReviewImage from "./ReviewImage";
import axios from "axios";
import { data } from "react-router-dom";

// 더미
const dummyArr = [
  {
    userId: 1,
    userProfilePic: "user1.png",
    name: "이수빈",
    reviewId: 1,
    reviewPic: ["c.jpg", "d.jpg"],
    rating: 4,
    content: "후기입니다",
    createdAt: "2025-01-28 15:30:00",
  },
  {
    userId: 2,
    userProfilePic: "user2.png",
    name: "김민준",
    reviewId: 2,
    reviewPic: ["a.jpg"],
    rating: 5,
    content: "정말 만족스러워요!",
    createdAt: "2025-01-27 10:15:00",
  },
  {
    userId: 3,
    userProfilePic: "user3.png",
    name: "박지현",
    reviewId: 3,
    reviewPic: ["e.jpg", "f.jpg", "g.jpg"],
    rating: 3,
    content: "괜찮았지만 개선이 필요해요.",
    createdAt: "2025-01-26 18:45:00",
  },
  {
    userId: 4,
    userProfilePic: "user4.png",
    name: "최서연",
    reviewId: 4,
    reviewPic: [],
    rating: 4,
    content:
      "여기를 방문하기 전에는 솔직히 조금 고민했었는데, 다녀오고 나서 그런 걱정이 왜 있었나 싶더군요. \n시설도 정말 깨끗하고, 깔끔하게 관리되고 있었습니다. \n특히 사진으로 봤던 것보다 실제로 보니 훨씬 더 예쁘고 분위기가 좋았어요. \n가족들과 함께 갔는데, 모두가 만족했고 다들 재방문 의사를 표현했답니다. \n음식도 기대 이상으로 맛있었고, 특히 디저트는 꼭 드셔보세요. 정말 최고였어요! \n사진 찍을 곳도 많아서 인생샷 건질 수 있는 장소였습니다. \n직원분들이 계속 세심하게 신경 써 주셔서 더욱 특별한 경험이 되었어요. \n다른 친구들에게도 이미 추천했는데, 그들도 정말 좋아할 것 같아요. \n굳이 단점을 꼽자면, 사람이 많아서 조금 기다렸던 점? 하지만 그 정도는 감수할 수 있었습니다. \n여기를 추천하지 않을 이유가 전혀 없는 것 같아요. 다음에도 꼭 다시 방문할 예정입니다!",
    createdAt: "2025-01-25 12:00:00",
  },
  {
    userId: 5,
    userProfilePic: "user5.png",
    name: "홍길동",
    reviewId: 5,
    reviewPic: ["h.jpg", "i.jpg"],
    rating: 2,
    content: "별로였어요. 기대 이하입니다.",
    createdAt: "2025-01-24 08:30:00",
  },
  {
    userId: 6,
    userProfilePic: "user6.png",
    name: "이하은",
    reviewId: 6,
    reviewPic: ["j.jpg"],
    rating: 5,
    content: "대박입니다. 정말 추천드려요!",
    createdAt: "2025-01-23 20:15:00",
  },
  {
    userId: 7,
    userProfilePic: "user7.png",
    name: "강지우",
    reviewId: 7,
    reviewPic: ["p.jpg", "q.jpg", "r.jpg", "s.jpg", "t.jpg", "u.jpg"],
    rating: 5,
    content:
      "여기를 방문하기 전에는 솔직히 조금 고민했었는데, 다녀오고 나서 그런 걱정이 왜 있었나 싶더군요. \n시설도 정말 깨끗하고, 깔끔하게 관리되고 있었습니다. \n특히 사진으로 봤던 것보다 실제로 보니 훨씬 더 예쁘고 분위기가 좋았어요. \n가족들과 함께 갔는데, 모두가 만족했고 다들 재방문 의사를 표현했답니다. \n음식도 기대 이상으로 맛있었고, 특히 디저트는 꼭 드셔보세요. 정말 최고였어요! \n사진 찍을 곳도 많아서 인생샷 건질 수 있는 장소였습니다. \n직원분들이 계속 세심하게 신경 써 주셔서 더욱 특별한 경험이 되었어요. \n다른 친구들에게도 이미 추천했는데, 그들도 정말 좋아할 것 같아요. \n굳이 단점을 꼽자면, 사람이 많아서 조금 기다렸던 점? 하지만 그 정도는 감수할 수 있었습니다. \n여기를 추천하지 않을 이유가 전혀 없는 것 같아요. 다음에도 꼭 다시 방문할 예정입니다!",
    createdAt: "2025-01-22 14:10:00",
  },
];

const Reviews = ({ contentData, strfId }) => {
  //useState
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewsArr, setReviewsArr] = useState([
    ...(contentData?.reviewList || dummyArr),
  ]);
  const [reviewIndex, setReviewIndex] = useState(6);

  useEffect(() => {
    console.log("리뷰 목록:", reviewsArr);
  }, [reviewsArr]);

  const getReview = useCallback(async () => {
    const sendData = {
      strf_id: strfId,
      last_index: reviewIndex,
    };
    console.log("리뷰 불러오기 리퀘스트:", sendData);
    try {
      const res = await axios.get(
        `/api/detail/review?strf_id=${strfId}&start_idx=${reviewIndex}&size=20`,
        sendData,
      );
      console.log("리뷰 더 불러오기:", res.data);
      const newArr = res.data.reviewList;
      const updatedArr = [...reviewsArr, ...newArr];
      setReviewsArr(updatedArr);
      setReviewIndex(prev => prev + 10);
    } catch (error) {
      console.log("리뷰 더 불러오기:", error);
    }
  }, []);

  return (
    <div>
      {/* 총 리뷰 수 */}
      <p>
        <span>{(contentData?.ratingTotalCnt || 1000).toLocaleString()}</span>
        개의 리뷰
      </p>
      {/* 리뷰 리스트 */}
      {contentData ? (
        <ul>
          {reviewsArr.map((item, index) => {
            return (
              <li
                key={index}
                className="flex flex-col gap-[20px] py-[30px] border-b border-slate-200"
              >
                {/* info */}
                <div className="flex flex-col gap-[10px]">
                  {/* 프로필, 닉네임, 리뷰 수 */}
                  <div className="flex gap-[15px] items-center justify-between">
                    <div className="flex gap-[10px] items-center">
                      <div className="w-[50px] h-[50px] rounded-full">
                        <img src={item.userProfilePic} alt="pofilePic" />
                      </div>
                      <p className="font-semibold text-slate-700 text-[18px]">
                        {item.name}
                      </p>
                    </div>
                    <div className="flex gap-[10px] items-center">
                      <LiaComment className="text-slate-300" />
                      <p className="font-bold text-[14px] text-slate-500">
                        리뷰 수
                      </p>
                    </div>
                  </div>
                  {/* 별점, 작성일 */}
                  <div className="flex gap-[15px] items-center justify-between">
                    <div className="flex gap-[5px]">
                      <Rate disabled count={5} value={item.rating} />
                      <p className="font-semibold text-[14px] text-slate-700">
                        {item.rating}
                      </p>
                    </div>
                    <div>
                      <p className="text-[14px] text-slate-500">
                        {item.createdAt}
                      </p>
                    </div>
                  </div>
                </div>
                {/* 리뷰 내용 */}
                <div>
                  <p className={index === selectedReview ? `` : `line-clamp-3`}>
                    {item.content}
                  </p>
                  <button
                    type="button"
                    className="text-primary p-0 text-[16px] font-semibold"
                    onClick={() => {
                      setSelectedReview(index);
                    }}
                  >
                    더보기
                  </button>
                </div>
                {/* 사진 */}
                <ReviewImage imgArr={item.reviewPic} />
              </li>
            );
          })}
        </ul>
      ) : (
        <ul>
          {/* 더미데이터 */}
          {dummyArr.map((item, index) => {
            return (
              <li className="flex flex-col gap-[20px] py-[30px] border-b border-slate-200">
                {/* info */}
                <div className="flex flex-col gap-[10px]">
                  {/* 프로필, 닉네임, 리뷰 수 */}
                  <div className="flex gap-[15px] items-center justify-between">
                    <div className="flex gap-[10px] items-center">
                      <div className="w-[50px] h-[50px] rounded-full">
                        <img src={item.userProfilePic} alt="pofilePic" />
                      </div>
                      <p className="font-semibold text-slate-700 text-[18px]">
                        {item.name}
                      </p>
                    </div>
                    <div className="flex gap-[10px] items-center">
                      <LiaComment className="text-slate-300" />
                      <p className="font-bold text-[14px] text-slate-500">
                        리뷰 수
                      </p>
                    </div>
                  </div>
                  {/* 별점, 작성일 */}
                  <div className="flex gap-[15px] items-center justify-between">
                    <div className="flex gap-[5px]">
                      <Rate disabled count={5} value={item.rating} />
                      <p className="font-semibold text-[14px] text-slate-700">
                        {item.rating}
                      </p>
                    </div>
                    <div>
                      <p className="text-[14px] text-slate-500">
                        {item.createdAt}
                      </p>
                    </div>
                  </div>
                </div>
                {/* 리뷰 내용 */}
                <div>
                  <p className={index === selectedReview ? `` : `line-clamp-3`}>
                    {item.content}
                  </p>
                  <button
                    type="button"
                    className="text-primary p-0 text-[16px] font-semibold"
                    onClick={() => {
                      setSelectedReview(index);
                    }}
                  >
                    더보기
                  </button>
                </div>
                {/* 사진 */}
                <ReviewImage imgArr={item.reviewPic} />
              </li>
            );
          })}
        </ul>
      )}
      <button
        type="button"
        className="w-full py-[20px] rounded-lg border border-slate-300"
        onClick={getReview}
      >
        리뷰 더보기
      </button>
    </div>
  );
};

export default memo(Reviews);
