import { atom } from "recoil";

export interface ISalesAtom {
  sumMonth1: string;
  sumMonth2?: string;
  sumMonth3?: string;
  sumMonth4?: string;
  sumMonth5?: string;
  sumMonth6?: string;
  sumMonth7?: string;
  sumMonth8?: string;
  sumMonth9?: string;
  sumMonth10?: string;
  sumMonth11?: string;
  sumMonth12?: string;
}

export const salesAtom = atom<ISalesAtom>({
  key: "salesAtom",
  default: {
    sumMonth1: "0",
  },
});
