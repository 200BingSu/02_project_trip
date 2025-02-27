import { atom } from "recoil";
import { Iuser, ProviderType } from "../types/interface";

export const tsUserAtom = atom<Iuser>({
  key: "tsUserAtom",
  default: {
    userId: 0,
    email: "",
    name: "",
    porfilePic: "",
    accessToken: "",
    providerType: ProviderType.LOCAL,
    role: [],
  },
});
