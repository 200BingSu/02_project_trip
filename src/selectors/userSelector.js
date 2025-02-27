import { selector } from "recoil";
import { userAtom } from "../atoms/userAtom";

export const resetUserData = selector({
  key: "resetUserData",
  get: ({ get }) => {
    const userData = get(userAtom);
    return userData;
  },
  set: ({ set }) => {
    set(userAtom, {
      userId: 0,
      email: "",
      name: "",
      profilePic: "",
      accessToken: "",
      role: [],
      sns: false,
    });
  },
});
