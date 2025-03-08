import { selector, selectorFamily } from "recoil";
import { salesAtom } from "../atoms/salesAtom";
import { IGraphData } from "../pages/business/BusinessIndex";
import dayjs from "dayjs";

const matchMonth = (x: string) => {
  switch (x) {
    case "sumMonth1":
      return `${dayjs().subtract(0, "month").format("YY-MM")}`;
    case "sumMonth2":
      return `${dayjs().subtract(1, "month").format("YY-MM")}`;
    case "sumMonth3":
      return `${dayjs().subtract(2, "month").format("YY-MM")}`;
    case "sumMonth4":
      return `${dayjs().subtract(3, "month").format("YY-MM")}`;
    case "sumMonth5":
      return `${dayjs().subtract(4, "month").format("YY-MM")}`;
    case "sumMonth6":
      return `${dayjs().subtract(5, "month").format("YY-MM")}`;
    case "sumMonth7":
      return `${dayjs().subtract(6, "month").format("YY-MM")}`;
    case "sumMonth8":
      return `${dayjs().subtract(7, "month").format("YY-MM")}`;
    case "sumMonth9":
      return `${dayjs().subtract(8, "month").format("YY-MM")}`;
    case "sumMonth10":
      return `${dayjs().subtract(9, "month").format("YY-MM")}`;
    case "sumMonth11":
      return `${dayjs().subtract(10, "month").format("YY-MM")}`;
    case "sumMonth12":
      return `${dayjs().subtract(11, "month").format("YY-MM")}`;
    default:
      return "과거";
  }
};
export const salesSelector = selector({
  key: "salesSelector",
  get: ({ get }): { id: string; data: IGraphData[] }[] => {
    const sales = get(salesAtom);
    const salesData = Object.entries(sales).map(([x, y], index) => ({
      key: index,
      x: matchMonth(x),
      y: Number(y),
    }));

    return [
      {
        id: "매출액",
        data: salesData.reverse(),
      },
    ];
  },
});

export const SortSalesData = selectorFamily({
  key: "SortSalesData",
  get:
    (param: "asc" | "desc") =>
    ({ get }) => {
      const sales = get(salesAtom);
      const salesData = Object.entries(sales).map(([x, y]) => ({
        x: matchMonth(x),
        y: Number(y),
      }));
      const sortedData = salesData.sort((a, b) =>
        param === "asc" ? a.x.localeCompare(b.x) : b.x.localeCompare(a.x),
      );
      return sortedData;
    },
});

export const SortSalesDataBySales = selectorFamily({
  key: "SortSalesDataBySales",
  get:
    (param: "asc" | "desc") =>
    ({ get }) => {
      const sales = get(salesAtom);
      const salesData = Object.entries(sales).map(([x, y]) => ({
        x: matchMonth(x),
        y: Number(y),
      }));
      const sortedData = salesData.sort((a, b) =>
        param === "asc" ? a.y - b.y : b.y - a.y,
      );
      return sortedData;
    },
});
