import { atom } from "recoil";

export const editTripAtom = atom({
  key: "editTripAtom",
  default: {
    title: "",
    trip_id: 0,
    start_at: "2025-02-01",
    end_at: "2025-02-07",
    del_user_list: [],
    ins_location_list: [],
    del_location_list: [],
  },
});
