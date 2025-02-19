import { atom } from "recoil";

export const searchAtom = atom({
  key: "searchAtom",
  default: {
    searchWord: "",
    searchData: [],
    start_idx: 0,
    category: 0,
  },
});
