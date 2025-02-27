import { atom } from "recoil";
import { ProviderType } from "../types/interface";

export const userAtom = atom({
  key: "userAtom",
  default: {
    userId: 0,
    email: "",
    name: "",
    porfilePic: "",
    accessToken: "",
    providerType: "LOCAL",
    role: [],
  },
});
