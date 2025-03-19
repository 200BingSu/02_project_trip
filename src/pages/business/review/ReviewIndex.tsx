import { Button, Spin } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineStar } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import ReviewItem from "../../../components/business/review/ReviewItem";
import StrfInfo from "../../../components/business/StrfInfo";
import NoData from "../../../components/common/NoData";
import { IReview } from "../../../types/interface";
import { getCookie } from "../../../utils/cookie";

export interface IReviewItem extends IReview {
  reviewReply?: string | null;
  replyId?: number;
  reviewReplyId?: string;
  reviewReplyCreatedAt?: string;
  isMore?: boolean;
  reviewId?: number;
  userId?: number;
  writerUserProfilePic?: string;
  userName?: string;
  content?: string;
  ratingAvg?: number;
  createdAt?: string;
  reviewPicList?: string[];
}

const ReviewIndex = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const strfId = Number(searchParams.get("strfId"));
  // 쿠키
  const accessToken = getCookie("accessToken");
  //useState
  const [reviewList, setReviewList] = useState<IReviewItem[]>([]);
  const [startIdx, setStartIdx] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMore, setIsMore] = useState(true);

  // API 리뷰 목록
  const getReviewList = async (type: string): Promise<IReviewItem[] | null> => {
    const url = "/api/business/review/all";
    setIsLoading(true);
    try {
      const res = await axios.get<IReviewItem[]>(
        `${url}?start_idx=${startIdx}&page_size=20`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const resultData = res.data;
      console.log("리뷰 목록 조회", resultData);
      if (resultData && type === "more") {
        setReviewList([...reviewList, ...resultData]);
      }
      if (resultData && type === "delete") {
        setStartIdx(0);
        setReviewList(resultData);
      }
      if (resultData[resultData.length - 1].isMore === false) {
        setIsMore(false);
      }
      setIsLoading(false);
      return resultData;
    } catch (error) {
      console.log("리뷰 목록 조회", error);
      setIsLoading(false);
      return null;
    }
  };
  // 더보기
  const handleClickMore = async () => {
    setStartIdx(startIdx + 20);
  };
  useEffect(() => {
    getReviewList("more");
  }, [startIdx]);
  return (
    <div className="flex flex-col gap-5">
      <StrfInfo />
      {/* 리뷰 목록 */}
      <Spin spinning={isLoading}>
        <section className="flex flex-col gap-10 pb-10">
          {reviewList[0]?.reviewId !== null ? (
            reviewList?.map((item, index) => (
              <ReviewItem
                key={index}
                item={item}
                strfId={strfId}
                setReviewList={setReviewList}
                getReviewList={getReviewList}
              />
            ))
          ) : (
            <NoData icon={<AiOutlineStar />} content="리뷰가 없습니다." />
          )}
        </section>
        {isMore && (
          <div className="flex justify-center">
            <Button
              variant="outlined"
              className="px-5 py-1 h-[9.6vw] max-h-[50px] text-xl text-slate-400 rounded-[32px]"
              onClick={handleClickMore}
            >
              더보기
            </Button>
          </div>
        )}
      </Spin>
    </div>
  );
};

export default ReviewIndex;
