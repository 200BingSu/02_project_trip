import { Rate } from "antd";
import axios from "axios";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { LiaComment } from "react-icons/lia";
import { useNavigate } from "react-router-dom";
import jwtAxios from "../../apis/jwt";
import { ProfilePic } from "../../constants/pic";
import "../../styles/antd-styles.css";
import { ReportType } from "../../types/enum";
import { IReview, IReviewData } from "../../types/interface";
import DynamicGrid from "../basic/DynamicGrid";
import { StrInfoProps } from "./StrInfo";

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
    const navigate = useNavigate();
    //useState
    const [reviewsData, setReviewsData] = useState<IReviewData[]>([]);
    const [moreData, setMoreData] = useState<boolean>();
    const [reviewIndex, setReviewIndex] = useState(0);
    const [selectedReview, setSelectedReview] = useState<number | null>(null);
    const [isLongText, setIsLongText] = useState<{
      [key: number]: boolean;
    }>({});
    const textRef = useRef<{ [key: number]: HTMLParagraphElement | null }>({});

    const [reviewCount, setReviewCount] = useState<number>(0);
    console.log(moreData);

    //쿼리스트링

    console.log("리뷰 목록:", reviewsData);
    console.log("reviewIndex:", reviewIndex);

    //getReviews
    const getReview = useCallback(async (): Promise<IReview | void> => {
      console.log("지금 보내는 start_idx", reviewIndex);
      try {
        const res = await jwtAxios.get<IReview>(
          `/api/review?strf_id=${strfId}&start_idx=${reviewIndex}`,
        );
        console.log("리뷰 불러오기:", res.data);
        setReviewsData([...reviewsData, ...res.data.dtoList]);
        setMoreData(res.data.more);
      } catch (error) {
        console.log("리뷰 불러오기:", error);
      }
    }, [reviewIndex, reviewsData, strfId]);

    const getReviewCount = async () => {
      try {
        const res = await axios.get(`/api/detail/count?strf_id=${strfId}`);
        setReviewCount(res.data.data);
        console.log("리뷰 수:", res);
      } catch (error) {
        console.error("리뷰 수 불러오기 실패:", error);
      }
    };

    useEffect(() => {
      getReview();
    }, [reviewIndex]);

    useEffect(() => {
      getReviewCount();
    }, [strfId]);

    // 리뷰 높이 체크 후 상태 업데이트
    useEffect(() => {
      const newIsLongText: { [key: number]: boolean } = {};

      reviewsData.forEach((_, index) => {
        const element = textRef.current[index];
        if (element) {
          const lineHeight = parseInt(
            window.getComputedStyle(element).lineHeight,
          );
          const height = element.scrollHeight;
          newIsLongText[index] = height > lineHeight * 3;
        }
      });

      setIsLongText(newIsLongText);
    }, [reviewsData]);

    return (
      <div>
        {/* 총 리뷰 수 */}
        <p className="text-base text-slate-700 px-4">
          <span className="font-semibold text-primary">{reviewCount}</span>
          개의 리뷰
        </p>
        {/* 리뷰 리스트 */}
        {reviewsData ? (
          <ul>
            {reviewsData?.map((item, index) => {
              const isMoreText = isLongText[index];

              return (
                <li
                  key={index}
                  className="flex flex-col gap-3 py-8 border-b border-slate-200 px-4 last:border-none"
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
                        <button
                          type="button"
                          className="text-slate-400 flex gap-1 items-center justify-center text-sm"
                          onClick={() => {
                            navigate(
                              `/report?type=${ReportType.STRF}&reportTarget=${contentData?.strfId}`,
                            );
                          }}
                        >
                          <span>|</span>
                          <span>신고</span>
                        </button>
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
                      ref={el => (textRef.current[index] = el)}
                      className={`text-sm tracking-tight ${
                        selectedReview === index ? "" : "line-clamp-3"
                      }`}
                    >
                      {item.content}
                    </p>
                    {isMoreText && selectedReview !== index && (
                      <button
                        type="button"
                        className="text-primary text-sm font-semibold mt-[6px]"
                        onClick={() => setSelectedReview(index)}
                      >
                        더보기
                      </button>
                    )}
                  </div>

                  {/* 사진 */}
                  {item.reviewPic && item.reviewPic.length > 0 && (
                    <DynamicGrid reviewPics={item} type="review" />
                  )}

                  {/* <ReviewImage
                    imgArr={item.reviewPic}
                    reviewId={item.reviewId}
                  /> */}
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
        {moreData === true && (
          <button
            type="button"
            className="w-full py-[20px] rounded-lg border border-slate-300"
            onClick={() => setReviewIndex(prev => prev + 10)}
          >
            리뷰 더보기
          </button>
          // ) : (
          //   <div className="flex flex-col gap-[20px] justify-center items-center">
          //     <i className="text-slate-300 text-[100px]">
          //       <LiaComment />
          //     </i>
          //     <p className="text-slate-400 text-[20px]">리뷰가 없습니다.</p>
          //   </div>
        )}
      </div>
    );
  };

export default memo(Reviews);
