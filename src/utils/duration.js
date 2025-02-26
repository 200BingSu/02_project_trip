import dayjs from "dayjs";

export const duration = item =>
  dayjs(item.endAt).diff(dayjs(item.startAt), "day");
