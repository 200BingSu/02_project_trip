import { atom } from "recoil";

export const editTripAtom = atom({
  key: "editTripAtom",
  default: {
    title: "",
    startDate: "",
    endDate: "",
    nowUser: [],
    tripLocationList: [],
    from: "",
    isEdit: false,
  },
});
