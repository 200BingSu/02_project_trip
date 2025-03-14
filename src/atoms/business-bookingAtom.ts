import { atom } from "recoil";
import { IBooking } from "../types/interface";
import { Dayjs } from "dayjs";

interface bookingAtom {
  date: (Dayjs | string)[];
  bookingList: IBooking[];
}

export const bookingAtom = atom<bookingAtom>({
  key: "bookingAtom",
  default: {
    date: [],
    bookingList: [],
  },
});
