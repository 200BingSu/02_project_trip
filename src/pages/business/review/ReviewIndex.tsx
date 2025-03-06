import { useSearchParams } from "react-router-dom";
import StrfInfo from "../../../components/business/StrfInfo";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import ReviewItem from "../../../components/business/review/ReviewItem";
import { useEffect, useState } from "react";
import { IBusinessReview, IReview } from "../../../types/interface";
import { Spin } from "antd";
import { mockReview } from "../../../mock/Review";
import axios from "axios";

export interface IReviewItem extends IReview {
  reviewReply?: string | null;
}

interface IGetReviewListRes {
  code: string;
  data: IReviewItem[];
}

const ReviewIndex = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const strfId = Number(searchParams.get("strfId"));

  //useState
  const [reviewList, setReviewList] = useState<IReviewItem[]>([]);
  const [startIdx, setStartIdx] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // API 리뷰 목록
  const getReviewList = async (): Promise<IGetReviewListRes | null> => {
    const url = "/api/business/review/all";
    setIsLoading(true);
    try {
      const res = await axios.get<IGetReviewListRes>(
        `${url}?start_idx=${startIdx}&page_size=10`,
      );
      const resultData = res.data;
      console.log("리뷰 목록 조회", resultData);
      if (resultData) {
        setReviewList(resultData.data);
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
      <StrfInfo name="업체 이름" id={strfId} category="숙소" />
      {/* 리뷰 목록 */}
      <Spin spinning={isLoading}>
        <section className="flex flex-col gap-10">
          {mockReview.map((item, index) => (
            <ReviewItem key={index} item={item} strfId={strfId} />
          ))}
        </section>
      </Spin>
    </div>
  );
};

export default ReviewIndex;
