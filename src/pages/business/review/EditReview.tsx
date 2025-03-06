import { useRecoilState, useRecoilValue } from "recoil";
import ReviewItem from "../../../components/business/review/ReviewItem";
import { editReviewAtom } from "../../../atoms/editReviewAtom";
import { useSearchParams } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import StrfInfo from "../../../components/business/StrfInfo";
import { Button } from "antd";

const EditReview = (): JSX.Element => {
  // 쿼리
  const [searchParams] = useSearchParams();
  const strfId = Number(searchParams.get("strfId"));
  const reviewId = Number(searchParams.get("reviewId"));
  const type = searchParams.get("type");
  // recoil
  const [editReview, setEditReview] = useRecoilState(editReviewAtom);
  return (
    <div className="flex flex-col gap-5">
      <StrfInfo name="업체 이름" id={strfId} category="숙소" />

      <div className="px-4">
        <h2 className="text-2xl font-semibold text-slate-600">
          {type === "create" ? "댓글 작성" : "댓글 수정"}
        </h2>
      </div>

      {editReview.userReview && (
        <ReviewItem strfId={strfId} item={editReview.userReview} />
      )}

      <div className="px-4">
        <TextArea
          placeholder="댓글을 입력해주세요"
          maxLength={50}
          style={{ resize: "none", height: "27.73vw", padding: "20px" }}
          value={editReview.reviewReply}
          onChange={e => {
            setEditReview({
              ...editReview,
              reviewReply: e.target.value,
            });
          }}
        />
      </div>

      <div className="px-4 py-3 flex gap-3 justify-end">
        <Button
          color="primary"
          variant="outlined"
          className="text-xl font-semibold px-3 py-1 max-h-[50px] h-[16vw]"
        >
          취소
        </Button>
        <Button
          type="primary"
          className="text-xl font-semibold px-3 py-1 max-h-[50px] h-[16vw]"
        >
          등록
        </Button>
      </div>
    </div>
  );
};

export default EditReview;
