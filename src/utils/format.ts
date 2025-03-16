// ID 포멧
export const formatId = (couponId: number): string => {
  return couponId.toString().padStart(5, "0");
};
