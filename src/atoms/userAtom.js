import { atom } from "recoil";

export const userAtom = atom({
  key: "userAtom",
  default: {
    userId: 0,
    email: "",
    name: "",
    profilePic: "",
    accessToken: "",
    role: [],
  }, // accessToken
});
