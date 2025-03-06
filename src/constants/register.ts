import { CategoryType } from "../types/enum";

export interface ICategory {
  category: CategoryType;
  name: string;
  emoji: string;
}

export const CATEGORY_LIST: ICategory[] = [
  {
    category: CategoryType.STAY,
    name: "숙소",
    emoji: "/images/emoji/hotel.png",
  },
  {
    category: CategoryType.RESTAURANT,
    name: "식당",
    emoji: "/images/emoji/rice.png",
  },
  {
    category: CategoryType.FEST,
    name: "축제",
    emoji: "/images/emoji/fest.png",
  },
  {
    category: CategoryType.TOUR,
    name: "관광지",
    emoji: "/images/emoji/tour.png",
  },
];
