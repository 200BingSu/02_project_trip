import { Spin } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ReviewItem from "../../../components/business/review/ReviewItem";
import StrfInfo from "../../../components/business/StrfInfo";
import { IReview } from "../../../types/interface";
import { getCookie } from "../../../utils/cookie";

export interface IReviewItem extends IReview {
  reviewReply?: string | null;
  replyId?: number;
  reviewReplyId?: string;
  reviewReplyCreatedAt?: string;
}

const ReviewIndex = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const strfId = Number(searchParams.get("strfId"));
  // 쿠키
  const accessToken = getCookie("accessToken");
  //useState
  const [reviewList, setReviewList] = useState<IReviewItem[]>([]);
  const [startIdx, setStartIdx] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // API 리뷰 목록
  const getReviewList = async (): Promise<IReviewItem[] | null> => {
    const url = "/api/business/review/all";
    setIsLoading(true);
    try {
      const res = await axios.get<IReviewItem[]>(
        `${url}?start_idx=${startIdx}&page_size=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const resultData = res.data;
      console.log("리뷰 목록 조회", resultData);
      if (resultData) {
        setReviewList(resultData);
        setStartIdx(startIdx + 10);
      }
      setIsLoading(false);
      return resultData;
    } catch (error) {
      console.log("리뷰 목록 조회", error);
      setIsLoading(false);
      return null;
    }
  };
  useEffect(() => {
    getReviewList();
  }, []);
  return (
    <div className="flex flex-col gap-5">
      <StrfInfo />
      {/* 리뷰 목록 */}
      <Spin spinning={isLoading}>
        <section className="flex flex-col gap-10 pb-10">
          {reviewList.map((item, index) => (
            <ReviewItem key={index} item={item} strfId={strfId} />
          ))}
        </section>
      </Spin>
    </div>
  );
};

export default ReviewIndex;
