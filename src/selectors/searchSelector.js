import { selector } from "recoil";
import { searchAtom } from "../atoms/searchAtom";
import { orderTypeArr } from "../constants/search";

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
      start_idx: 0,
      category: 0,
      amenityId: [],
      orderType: 0,
      more: true,
      count: 0,
    });
  },
});
