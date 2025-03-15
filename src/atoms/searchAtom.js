import { atom } from "recoil";
import { orderTypeArr } from "../constants/search";

export const searchAtom = atom({
  key: "searchAtom",
  default: {
    searchData: [],
    start_idx: 0,
    category: 0,
    amenityId: [],
    orderType: 0,
    more: true,
    count: 0,
    fromContent: false,
  },
});
