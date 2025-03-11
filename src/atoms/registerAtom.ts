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
      locationDetailId: 0,
    },
    tell: {
      areaCode: "053",
      number: "",
    },
    image: [],
    duration: { startAt: "", endAt: "" },
    checkTime: { checkIn: "", checkOut: "" },
    holiday: { frequency: "", day: [] },
    bio: "",
    state: 0,
    // amenity: [],
    // menuList: [
    //   {
    //     menuId: 0,
    //     menuPic: [],
    //     name: "",
    //     price: 0,
    //     recomCapacity: 0,
    //     maxCapacity: 0,
    //     addPrice: 0,
    //     roomList: [],
    //   },
    // ],
  },
});
