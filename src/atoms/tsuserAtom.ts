import { atom } from "recoil";
import { Iuser } from "../types/interface";
import { ProviderType, ROLE } from "../types/enum";

export const tsUserAtom = atom<Iuser>({
  key: "tsUserAtom",
  default: {
    userId: 0,
    email: "",
    name: "",
    profilePic: "",
    accessToken: "",
    providerType: ProviderType.LOCAL,
    role: [ROLE.GUEST],
    tell: "",
    birth: "",
    busiNum: "",
    strfId: "",
    title: "",
    category: "",
  },
});
