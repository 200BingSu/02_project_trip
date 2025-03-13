import { Rate } from "antd";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { LiaComment } from "react-icons/lia";
import jwtAxios from "../../apis/jwt";
import { ProfilePic } from "../../constants/pic";
import { IReview } from "../../types/interface";
import ReviewImage from "./ReviewImage";
import { StrInfoProps } from "./StrInfo";
import "../../styles/antd-styles.css";

const Reviews = ({ strfId, contentData }: StrInfoProps) =>
  // {
  // reviewsData,
  // setReviewsData,
  // reviewIndex,
  // setReviewIndex,
  // }
  {
    console.log("contentData", contentData);
    // 쿠키

    //useState
    const [selectedReview, setSelectedReview] = useState<number | null>(null);
    const [reviewsData, setReviewsData] = useState<IReview[]>([]);
    const [reviewIndex, setReviewIndex] = useState(0);
    const [reviewText, setReviewText] = useState(false);
    const reviewRef = useRef<HTMLParagraphElement | null>(null);
    //쿼리스트링

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
        const res = await jwtAxios.get(
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

    useEffect(() => {
      if (reviewRef.current) {
        const el = reviewRef.current;
        const lineHeight = parseInt(window.getComputedStyle(el).lineHeight, 4);
        setReviewText(el.scrollHeight > lineHeight * 4);
      }
    }, []);

    return (
      <div>
        {/* 총 리뷰 수 */}
        <p>
          {/* <span>{(contentData?.ratingTotalCnt || 1000).toLocaleString()}</span> */}
          개의 리뷰
        </p>
        {/* 리뷰 리스트 */}
        {reviewsData ? (
          <ul>
            {reviewsData?.map((item, index) => {
              return (
                <li
                  key={index}
                  className="flex flex-col gap-3 py-8 border-b border-slate-200 px-4"
                >
                  {/* info */}
                  <div className="flex flex-col gap-[6px]">
                    {/* 프로필, 닉네임, 리뷰 수 */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <img
                            src={`${ProfilePic}/${item.writerUserId}/${item.writerUserPic}`}
                            alt="pofilePic"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="font-semibold text-slate-700 text-base">
                          {item.writerUserName}
                        </p>
                      </div>
                      <div className="flex gap-[6px] items-center">
                        <LiaComment className="text-base text-slate-300" />
                        <p className="font-semibold text-sm text-slate-500">
                          {item.userWriteReviewCnt}
                        </p>
                      </div>
                    </div>
                    {/* 별점, 작성일 */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-[6px]">
                        <Rate
                          disabled
                          count={5}
                          value={item.rating}
                          className="custom-review-rate"
                        />
                        <p className="font-semibold text-sm text-slate-700">
                          {item.rating}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">
                          {item.reviewWriteDate
                            .split(" ")[0]
                            .replace(/-/g, ".")}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* 리뷰 내용 */}
                  <div>
                    <p
                      className={`text-sm tracking-tight ${index === selectedReview ? `` : `line-clamp-3`}`}
                      ref={reviewRef}
                    >
                      {item.content}
                    </p>
                    {reviewText && (
                      <button
                        type="button"
                        className="text-primary p-0 text-base font-semibold"
                        onClick={() =>
                          setSelectedReview(
                            index === selectedReview ? null : index,
                          )
                        }
                      >
                        {index === selectedReview ? "접기" : "더보기"}
                      </button>
                    )}
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
