import { atom } from "recoil";
import { Istore } from "../types/interface";

export const registerAtom = atom<Istore>({
  key: "registerAtom",
  default: {
    category: "",
    name: "",
    location: {
      postcode: "",
      latitude: 0,
      longitude: 0,
      address: "",
      addressDetail: "",
    },
    tell: {
      areaCode: "053",
      number: "",
    },
    image: [],
    businessHours: { startTime: "", endTime: "" },
    checkTime: { checkIn: "", checkOut: "" },
    holiday: { frequency: "", day: [] },
    bio: "",
    menuList: [],
  },
});
