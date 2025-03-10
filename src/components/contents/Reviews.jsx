import { Avatar, Button, Rate, Skeleton } from "antd";
import React, { memo, useCallback, useEffect, useState } from "react";
import { LiaComment } from "react-icons/lia";
import ReviewImage from "./ReviewImage";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCookie } from "../../utils/cookie";
import TitleHeader from "../layout/header/TitleHeader";
import { ProfilePic } from "../../constants/pic";

const Reviews = () =>
  // {
  // reviewsData,
  // setReviewsData,
  // reviewIndex,
  // setReviewIndex,
  // }
  {
    // 쿠키
    const accessToken = getCookie("accessToken");

    //useState
    const [selectedReview, setSelectedReview] = useState(null);
    const [reviewsData, setReviewsData] = useState([]);
    const [reviewIndex, setReviewIndex] = useState(0);
    //쿼리스트링
    const [searchParams] = useSearchParams();
    const strfId = searchParams.get("strfId");

    useEffect(() => {
      console.log("리뷰 목록:", reviewsData);
    }, [reviewsData]);
    useEffect(() => {
      console.log("reviewIndex:", reviewIndex);
    }, [reviewIndex]);

    //getReviews
    const getReview = useCallback(async () => {
      console.log("지금 보내는 start_idx", reviewIndex);
      try {
        const res = await axios.get(
          `/api/review?strf_id=${strfId}&start_idx=${reviewIndex}`,
        );
        console.log("리뷰 불러오기:", res.data);
        setReviewsData([...reviewsData, ...res.data]);
      } catch (error) {
        console.log("리뷰 불러오기:", error);
      }
    }, [reviewIndex, reviewsData, strfId]);

    useEffect(() => {
      getReview();
    }, [reviewIndex]);

    return (
      <div>
        {/* 총 리뷰 수 */}
        <p>
          {/* <span>{(contentData?.ratingTotalCnt || 1000).toLocaleString()}</span>
        개의 리뷰 */}
        </p>
        {/* 리뷰 리스트 */}
        {reviewsData ? (
          <ul>
            {reviewsData?.map((item, index) => {
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
                        <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                          <img
                            src={`${ProfilePic}/${item.writerUserId}/${item.writerUserPic}`}
                            alt="pofilePic"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="font-semibold text-slate-700 text-[18px]">
                          {item.writerUserName}
                        </p>
                      </div>
                      <div className="flex gap-[10px] items-center">
                        <LiaComment className="text-slate-300" />
                        <p className="font-bold text-[14px] text-slate-500">
                          {item.userWriteReviewCnt}
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
                          {item.reviewWriteDate}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* 리뷰 내용 */}
                  <div>
                    <p
                      className={index === selectedReview ? `` : `line-clamp-3`}
                    >
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
                  <ReviewImage
                    imgArr={item.reviewPic}
                    reviewId={item.reviewId}
                  />
                </li>
              );
            })}
          </ul>
        ) : (
          <ul>
            {/* 더미데이터 */}
            <li className="flex flex-col gap-[20px] py-[30px] border-b border-slate-200"></li>
          </ul>
        )}
        {reviewsData.length > 0 ? (
          <button
            type="button"
            className="w-full py-[20px] rounded-lg border border-slate-300"
            onClick={() => setReviewIndex(prev => prev + 10)}
          >
            리뷰 더보기
          </button>
        ) : (
          <div className="flex flex-col gap-[20px] justify-center items-center">
            <i className="text-slate-300 text-[100px]">
              <LiaComment />
            </i>
            <p className="text-slate-400 text-[20px]">리뷰가 없습니다.</p>
          </div>
        )}
      </div>
    );
  };

export default memo(Reviews);
