import { Button, message, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilState, useResetRecoilState } from "recoil";
import { editReviewAtom } from "../../../atoms/editReviewAtom";
import ReviewItem from "../../../components/business/review/ReviewItem";
import StrfInfo from "../../../components/business/StrfInfo";
import { getCookie } from "../../../utils/cookie";

interface IBReviewApi {
  reviewId?: number;
  replyId?: number;
  content?: string;
}

const EditReview = (): JSX.Element => {
  // 쿠키
  const accessToken = getCookie("accessToken");
  // 쿼리
  const [searchParams] = useSearchParams();

  const strfId = Number(searchParams.get("strfId"));
  const reviewId = Number(searchParams.get("reviewId"));
  const replayId = Number(searchParams.get("replayId"));

  const type = searchParams.get("type");
  // useNavigate
  const navigate = useNavigate();
  const navigateToReview = () => {
    navigate(`/business/review?strfId=${strfId}`);
  };

  // recoil
  const [editReview, setEditReview] = useRecoilState(editReviewAtom);
  const resetReviewData = useResetRecoilState(editReviewAtom);
  const [isLoading, setIsLoading] = useState(false);
  // API 대댓글 생성
  const createReply = async (): Promise<string | null> => {
    const url = "/api/business/review/create";
    const data = {
      reviewId: reviewId,
      content: editReview.reviewReply,
    };
    setIsLoading(true);
    try {
      const res = await axios.post<string>(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const resultData = res.data;
      if (resultData) {
        setIsLoading(false);
        navigateToReview();
        resetReviewData();

        message.success("리뷰가 작성되었습니다");
      }
      console.log("대댓글 생성", resultData);
      return resultData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // AxiosError 타입으로 안전하게 처리
        console.error("Error status:", error.response?.status);
        console.error("Error message:", error.message);
      }
      console.log("대댓글 생성", error);
      message.success("리뷰 작성에 실패했습니다");
      setIsLoading(false);
      return null;
    }
  };
  // API 대댓글 수정
  const updateReply = async (): Promise<IBReviewApi | null> => {
    const url = "/api/business/review/update";
    const data = {
      reviewReplyId: replayId,
      content: editReview.reviewReply,
    };
    try {
      const res = await axios.put<IBReviewApi>(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const resultData = res.data;
      if (resultData) {
        resetReviewData();
        navigateToReview();
        message.success("리뷰 수정을 성공했습니다.");
      }
      console.log("대댓글 생성", resultData);
      return resultData;
    } catch (error) {
      console.log("대댓글 생성", error);
      message.success("리뷰 수정에 실패했습니다.");
      return null;
    }
  };
  // 등록
  const hadleClickFinish = () => {
    type === "create" ? createReply() : updateReply();
  };

  return (
    <div className="flex flex-col gap-5">
      <StrfInfo />
      <div className="px-4">
        <h2 className="text-2xl font-semibold text-slate-600">
          {type === "create" ? "댓글 작성" : "댓글 수정"}
        </h2>
      </div>

      {editReview.userReview && (
        <ReviewItem strfId={strfId} item={editReview.userReview} />
      )}

      <div className="px-4">
        <Spin spinning={isLoading}>
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
        </Spin>
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
          onClick={hadleClickFinish}
        >
          등록
        </Button>
      </div>
    </div>
  );
};

export default EditReview;
