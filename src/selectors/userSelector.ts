import { selector } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { tsUserAtom } from "../atoms/tsuserAtom";
import { ProviderType } from "../types/enum";

export const resetUserData = selector({
  key: "resetUserData",
  get: ({ get }) => {
    const userData = get(tsUserAtom);
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
      providerType: ProviderType.LOCAL,
      tell: "",
      birth: "",
    });
  },
});
