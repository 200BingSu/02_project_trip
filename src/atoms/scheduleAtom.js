import { atom } from "recoil";

export const scheduleAtom = atom({
  key: "scheduleAtom",
  default: {
    nowTripId: 0,
    location: "",
    prevLocation: { lat: 0, lng: 0 },
    nowLocation: { lat: 0, lng: 0 },
  },
});
