// ID 포멧
export const formatId = (couponId: number): string => {
  if (couponId.toString().length > 3) {
    return couponId.toString();
  } else if (couponId.toString().length > 2) {
    return "00" + couponId;
  } else if (couponId.toString().length > 1) {
    return "000" + couponId;
  } else {
    return "0000" + couponId;
  }
};
