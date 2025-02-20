import { selector } from "recoil";
import { searchAtom } from "../atoms/searchAtom";

export const resetEditData = selector({
  key: "resetEditData",
  get: ({ get }) => {
    const editData = get(editTripAtom);
    return editData;
  },
  set: ({ set }) => {
    set(searchAtom, {
      title: "",
      startDate: "",
      endDate: "",
      nowUser: [],
      tripLocationList: [],
    });
  },
});
