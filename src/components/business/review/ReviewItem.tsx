import { Button, Rate } from "antd";
import { useState, useRef, useEffect } from "react";
import { ProfilePic } from "../../../constants/pic";
import { IReviewItem } from "../../../pages/business/review/ReviewIndex";
import ReviewImage from "../../contents/ReviewImage";
import { CgMoreVerticalAlt } from "react-icons/cg";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { editReviewAtom } from "../../../atoms/editReviewAtom";

interface IReviewItemProps {
  strfId: number;
  item: IReviewItem;
}

const ReviewItem = ({ strfId, item }: IReviewItemProps) => {
  // useNavigate
  const navigate = useNavigate();
  const navigateToWriteReply = () => {
    navigate(
      `/business/review/edit?type=create&strfId=${strfId}&reviewId=${item.review_id}`,
    );
  };
  // useLocation
  const location = useLocation();
  const pathname = location.pathname;
  // recoil
  const [editReview, setEditReview] = useRecoilState(editReviewAtom);

  // useState
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOverflow, setIsOverflow] = useState<boolean>(false);
  const contentRef = useRef<HTMLParagraphElement>(null);
  // 댓글 버튼
  const handleClickButton = () => {
    setEditReview({ ...editReview, userReview: item });
    navigateToWriteReply();
  };
  useEffect(() => {
    if (contentRef.current) {
      setIsOverflow(contentRef.current.scrollHeight > 72);
    }
  }, [item.content]);

  return (
    <div className="flex flex-col gap-4 px-4">
      {/* 유저 리뷰 */}
      <section className="flex flex-col gap-3">
        {/* 유저 정보 */}
        <div className="flex items-center gap-4">
          <div className="bg-slate-200 rounded-full w-10 h-10 overflow-hidden">
            <img
              src={`${ProfilePic}/${item.user_id}/${item.writerUserProfilePic}`}
              alt="프로필 사진"
            />
          </div>
          <p className="text-lg font-semibold text-slate-700">
            {item.userName}
          </p>
        </div>
        {/* 별점, 작성일 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rate value={item.ratingAvg} disabled />
            <p className="text-sm font-semibold text-slate-700">
              {item.ratingAvg}
            </p>
          </div>
          <p className="text-sm text-slate-500">{item.created_at}</p>
        </div>
        {/* 리뷰 내용 */}
        <div>
          <p
            ref={contentRef}
            className={`text-base text-slate-700 overflow-hidden transition-[max-height] duration-500 ease-in-out ${
              isOpen ? "max-h-[1000px]" : "max-h-[72px]"
            }`}
          >
            {item.content}
          </p>
          {isOverflow && (
            <button
              type="button"
              className="text-primary text-base font-semibold mt-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? "접기" : "더보기"}
            </button>
          )}
        </div>
        {/* 사진 */}
        <ReviewImage
          imgArr={[{ pic: "1.png" }, { pic: "2.png" }, { pic: "3.png" }]}
          reviewId={1}
        />
      </section>
      {/* 사장님 리뷰 */}
      {item.reviewReply && (
        <section className="p-4 bg-slate-100 rounded-lg flex flex-col gap-3">
          {/* 사업자 */}
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-slate-700">사장님</p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-500">2025-03-06</p>
              <button
                type="button"
                className="text-slate-500 text-xl font-semibold"
              >
                <CgMoreVerticalAlt />
              </button>
            </div>
          </div>
          {/* 리뷰 내용 */}
          <div>
            <p className="text-base text-slate-700">{item.reviewReply}</p>
          </div>
        </section>
      )}
      {/* 댓글 작성 버튼 */}
      {pathname === "/business/review/edit" || item.reviewReply ? null : (
        <Button
          color="primary"
          variant="outlined"
          className="text-xl font-semibold px-3 py-1 max-h-[50px] h-[16vw]"
          onClick={handleClickButton}
        >
          댓글 작성
        </Button>
      )}
    </div>
  );
};

export default ReviewItem;
