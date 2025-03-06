import { useSearchParams } from "react-router-dom";
import StrfInfo from "../../../components/business/StrfInfo";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import ReviewItem from "../../../components/business/review/ReviewItem";

const ReviewIndex = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const strfId = Number(searchParams.get("strfId"));
  return (
    <div className="flex flex-col gap-5">
      <TitleHeaderTs title="리뷰 관리" />
      <StrfInfo name="업체 이름" id={strfId} category="숙소" />
      {/* 리뷰 목록 */}
      <section className="px-4 flex flex-col gap-5">
        <ReviewItem />
      </section>
    </div>
  );
};

export default ReviewIndex;
