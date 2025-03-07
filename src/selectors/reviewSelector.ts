import { selector } from "recoil";
import { editReviewAtom } from "../atoms/editReviewAtom";

export const resetEditReview = selector({
  key: "resetEditReview",
  get: ({ get }) => {
    const editData = get(editReviewAtom);
    return editData;
  },
  set: ({ set }) => {
    set(editReviewAtom, {
      userReview: null,
      reviewReply: "",
    });
  },
});
