import { UploadFile } from "antd";
import { atom } from "recoil";
import { ParlorType } from "../components/business/menu/RoomForm";

interface menuType {
  menuPic: UploadFile | File | null;
  menuTitle: string;
  menuPrice: number;
  rooms: number[];
  parlors: ParlorType[];
  ameniPoints: number[];
}

export const menuAtom = atom<menuType>({
  key: "menuAtom",
  default: {
    menuPic: null,
    menuTitle: "",
    menuPrice: 0,
    rooms: [],
    parlors: [{ recomCapacity: 0, maxCapacity: 0, surcharge: 0, menuId: 0 }],
    ameniPoints: [],
  },
});
