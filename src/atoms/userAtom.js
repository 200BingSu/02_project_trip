import { atom } from "recoil";

export const userAtom = atom({
  key: "userAtom",
  default: {
    userId: 0,
    accessToken: "",
  }, // accessToken
});
