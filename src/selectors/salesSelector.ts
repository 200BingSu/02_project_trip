import { selector } from "recoil";
import { salesAtom } from "../atoms/salesAtom";
import { IGraphData } from "../pages/business/BusinessIndex";
import dayjs from "dayjs";

const nowMonth = dayjs().format("MM");
const matchMonth = (x: string) => {
  switch (x) {
    case "sumMonth1":
      return `${dayjs().subtract(1, "month").format("MM")}월`;
    case "sumMonth2":
      return `${dayjs().subtract(2, "month").format("MM")}월`;
    case "sumMonth3":
      return `${dayjs().subtract(3, "month").format("MM")}월`;
    case "sumMonth4":
      return `${dayjs().subtract(4, "month").format("MM")}월`;
    case "sumMonth5":
      return `${dayjs().subtract(5, "month").format("MM")}월`;
    case "sumMonth6":
      return `${dayjs().subtract(6, "month").format("MM")}월`;
    case "sumMonth7":
      return `${dayjs().subtract(7, "month").format("MM")}월`;
    case "sumMonth8":
      return `${dayjs().subtract(8, "month").format("MM")}월`;
    case "sumMonth9":
      return `${dayjs().subtract(9, "month").format("MM")}월`;
    case "sumMonth10":
      return `${dayjs().subtract(10, "month").format("MM")}월`;
    case "sumMonth11":
      return `${dayjs().subtract(11, "month").format("MM")}월`;
    case "sumMonth12":
      return `${dayjs().subtract(12, "month").format("MM")}월`;
    default:
      return "과거";
  }
};
export const salesSelector = selector({
  key: "salesSelector",
  get: ({ get }): IGraphData[] => {
    const sales = get(salesAtom);
    const salesData = Object.entries(sales).map(([x, y]) => ({
      x: matchMonth(x),
      y: Number(y),
    }));

    return salesData;
  },
});
