import { selector } from "recoil";
import { searchAtom } from "../atoms/searchAtom";

export const resetSearchData = selector({
  key: "resetSearchData",
  get: ({ get }) => {
    const searchData = get(searchAtom);
    return searchData;
  },
  set: ({ set }) => {
    set(searchAtom, {
      searchWord: "",
      searchData: [],
      startIndex: 0,
      category: 0,
    });
  },
});
