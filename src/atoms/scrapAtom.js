import { atom } from "recoil";

export const scrapAtom = atom({
  key: "scrapAtom",
  default: {
    tripReviewId: 0,
    copyTripId: 0,
    newStartAt: "",
    newEndAt: "",
  },
});
