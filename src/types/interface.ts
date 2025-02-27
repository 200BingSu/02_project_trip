export enum ProviderType {
  KAKAO = "KAKAO",
  LOCAL = "LOCAL",
}

export interface Iuser {
  birth?: string;
  email?: string;
  name?: string;
  profilePic?: string;
  providerType?: ProviderType | null;
  userId?: number;
  accessToken?: string;
  role?: string[];
  tell?: string;
}

export interface ICoupon {
  couponId: string;
  title: string;
  expiredAt: string;
  discountPer: number;
  distributeAt: string;
  daysLeft: number;
}
