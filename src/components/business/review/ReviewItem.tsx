import { Button, message, Rate } from "antd";
import { Dispatch, useEffect, useRef, useState } from "react";
import { CgMoreVerticalAlt } from "react-icons/cg";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { editReviewAtom } from "../../../atoms/editReviewAtom";
import { ProfilePic } from "../../../constants/pic";
import { IReviewItem } from "../../../pages/business/review/ReviewIndex";
import BottomSheet from "../../basic/BottomSheet";
import ReviewImage from "../../contents/ReviewImage";
import { BiSolidEditAlt, BiTrash } from "react-icons/bi";
import CenterModalTs from "../../common/CenterModalTs";
import axios from "axios";
import { getCookie } from "../../../utils/cookie";

interface IReviewItemProps {
  strfId: number;
  item: IReviewItem;
  setStartIdx?: Dispatch<React.SetStateAction<number>>;
  setReviewList?: Dispatch<React.SetStateAction<IReviewItem[]>>;
  getReviewList?: (type: string) => Promise<IReviewItem[] | null>;
}

const ReviewItem = ({ strfId, item, getReviewList }: IReviewItemProps) => {
  // 쿠키
  const accessToken = getCookie("accessToken");
  // 쿼리
  const [searchParam] = useSearchParams();
  const type = searchParam.get("type");
  // useNavigate
  const navigate = useNavigate();
  const navigateToWriteReply = () => {
    navigate(
      `/business/review/edit?type=create&strfId=${strfId}&reviewId=${item.reviewId}`,
    );
  };
  const navigateToEditReply = () => {
    navigate(
      `/business/review/edit?type=edit&strfId=${strfId}&reviewId=${item.reviewId}&replayId=${item.reviewReplyId}`,
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
  const [isOpenBottom, setIsOpenBottom] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  // API 삭제하기
  const deleteReview = async (): Promise<string | null> => {
    const url = `/api/business/review/delete?replyId=${item.reviewReplyId}`;
    try {
      const res = await axios.delete<string | null>(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const resultData = res.data;
      console.log("삭제", resultData);
      message.success("삭제가 완료되었습니다");
      if (resultData) {
        getReviewList?.("delete");
        setIsOpenBottom(false);
        setIsOpenModal(false);
      }
      return resultData;
    } catch (error) {
      console.log("삭제", error);
      message.error("삭제를 실패했습니다");
      return null;
    }
  };

  const actions = [
    {
      label: (
        <div className="flex items-center gap-3 px-4 py-[14px] text-lg text-slate-500">
          <BiSolidEditAlt className="text-slate-300" />
          수정하기
        </div>
      ),
      onClick: () => handleClickEdit(),
    },
    {
      label: (
        <div className="flex items-center gap-3 px-4 py-[14px] text-lg text-slate-500">
          <BiTrash className="text-slate-400" />
          삭제하기
        </div>
      ),
      onClick: () => handleClickDelete(),
    },
  ];

  // 바텀시트
  const handleBottomSheet = () => {
    setIsOpenBottom(!isOpenBottom);
  };
  // 댓글 버튼
  const handleClickButton = () => {
    setEditReview({ ...editReview, userReview: item });
    navigateToWriteReply();
  };
  // 수정하기 버튼
  const handleClickEdit = () => {
    setEditReview({
      ...editReview,
      userReview: item,
      reviewReply: item.reviewReply ?? "",
    });
    navigateToEditReply();
  };
  const handleClickDelete = () => {
    setIsOpenModal(true);
    setIsOpenBottom(false);
  };
  useEffect(() => {
    if (contentRef.current) {
      setIsOverflow(contentRef.current.scrollHeight > 72);
    }
  }, [item.content]);

  return (
    <div className="flex flex-col gap-4 px-4 py-5">
      {/* 유저 리뷰 */}
      <section className="flex flex-col gap-3">
        {/* 유저 정보 */}
        <div className="flex items-center gap-4">
          <div className="bg-slate-200 rounded-full w-10 h-10 overflow-hidden">
            <img
              src={`${ProfilePic}/${item.userId}/${item.writerUserProfilePic}`}
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
          <p className="text-sm text-slate-500">{item.createdAt}</p>
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
        <ReviewImage imgArr={item.reviewPicList} reviewId={item.reviewId} />
      </section>
      {/* 사장님 리뷰 */}
      {item.reviewReply && type !== "edit" && (
        <section className="p-4 bg-slate-100 rounded-lg flex flex-col gap-3">
          {/* 사업자 */}
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-slate-700">사장님</p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-500">
                {item.reviewReplyCreatedAt}
              </p>
              {pathname !== "/business/review/edit" && (
                <button
                  type="button"
                  className="text-slate-500 text-xl font-semibold"
                  onClick={() => {
                    setIsOpenBottom(true);
                  }}
                >
                  <CgMoreVerticalAlt />
                </button>
              )}
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
      <BottomSheet
        open={isOpenBottom}
        onClose={handleBottomSheet}
        actions={actions}
      />
      {isOpenModal && (
        <CenterModalTs
          handleClickCancle={() => setIsOpenModal(false)}
          handleClickSubmit={deleteReview}
          content="삭제하시겠습니까?"
        />
      )}
    </div>
  );
};

export default ReviewItem;
