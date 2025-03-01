import { atom } from "recoil";
import { ProviderType } from "../types/enum";

export const userAtom = atom({
  key: "userAtom",
  default: {
    userId: 0,
    email: "",
    name: "",
    profilePic: "",
    accessToken: "",
    providerType: ProviderType.LOCAL,
    role: [],
    tell: "",
    birth: "",
  },
});
