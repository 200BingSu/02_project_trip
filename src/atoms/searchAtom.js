import { atom } from "recoil";

export const searchAtom = atom({
  key: "searchAtom",
  default: {
    searchWord: "",
    searchData: [],
    lastIndex: 0,
    category: 0,
  },
});
