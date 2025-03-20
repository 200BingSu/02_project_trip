import { atom } from "recoil";

export const tripAtom = atom({
  key: "tripAtom",
  default: {
    nowTripId: 0,
    day: 1,
    lastSeq: 0,
    prevScheName: "",
    prevSchelat: 0,
    prevSchelng: 0,
    nowName: "",
    nowLat: 0,
    nowLng: 0,
  },
});
