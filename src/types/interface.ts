export enum ProviderType {
  KAKAO = "KAKAO",
  LOCAL = "LOCAL",
}

export interface Iuser {
  birth?: string;
  email?: string;
  name?: string;
  porfilePic?: string;
  providerType?: ProviderType;
  userId?: number;
  accessToken?: string;
  role?: string[];
  tell?: string;
}
