import { selector } from "recoil";

import { userBookingAtom } from "../atoms/user-bookingAtom";

export const userBookingSelector = selector({
  key: "userBookingSelector",
  get: ({ get }) => {
    const bookingData = get(userBookingAtom);
    const filterData = bookingData.data.filter(
      item => item.state === 0 || item.state === 1,
    );

    return filterData;
  },
});
