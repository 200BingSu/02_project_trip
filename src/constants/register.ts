import { CategoryType } from "../types/enum";

export interface ICategory {
  category: CategoryType;
  name: string;
  emoji: string;
}

export const CATEGORY_LIST: ICategory[] = [
  {
    category: CategoryType.HOTEL,
    name: "숙소",
    emoji: "/images/emoji/hotel.png",
  },
  {
    category: CategoryType.RESTAURANT,
    name: "식당",
    emoji: "/images/emoji/rice.png",
  },
];
