import { atom } from "recoil";

export interface ISales {
  month: string;
  totalSales: number;
}
export interface ISalesAtom {
  data: ISales[];
}

export const salesAtom = atom<ISalesAtom>({
  key: "salesAtom",
  default: {
    data: [],
  },
});
