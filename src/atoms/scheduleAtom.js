import { atom } from "recoil";

export const scheduleAtom = atom({
  key: "scheduleAtom",
  default: {
    selectedTripId: 0,
  },
});
