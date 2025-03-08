import { atom } from "recoil";
import { IReview } from "../types/interface";

/**
 * StompClient
 * connect: 서버에 연결 시도
 * disconnect: 서버 연결 해제
 * subscribe: 특정 주제에 메시지 구독
 * publish: 특정 주제에 메시지 발행
 * unsubscribe: 특정 주제에 대한 구독 취소
 */
interface EditReviewState {
  userReview: IReview | null;
  reviewReply: string;
}

export const editReviewAtom = atom<EditReviewState>({
  key: "editReview",
  default: {
    userReview: null,
    reviewReply: "",
  },
});
