import { atom } from "recoil";

export const userBookingAtom = atom({
  key: "userBookingAtom",
  default: {
    data: [],
  },
});
