import { ICoupon } from "../types/interface";

export const mockCouponList: ICoupon[] = [
  {
    couponId: 51,
    title: "예약 쿠폰",
    expiredAt: "2025-03-01T09:52:56",
    discountPer: 10,
    distributeAt: "2025-03-01T22:52:56",
    strfId: 1,
  },
  {
    couponId: 52,
    title: "조기 예약 쿠폰",
    expiredAt: "2025-03-01T06:31:09",
    discountPer: 10,
    distributeAt: "2025-03-01T06:31:09",
    strfId: 1,
  },
];
