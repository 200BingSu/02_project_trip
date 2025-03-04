import { UploadFile } from "antd";
import { ProviderType } from "./enum";

// children
export interface Ichildren {
  children?: React.ReactNode;
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
  couponId: number;
  title: string;
  expiredAt: string;
  discountPer: number;
  distributeAt: string;
  daysLeft?: number;
}

export interface Imenu {
  menuId?: number;
  menuPic?: UploadFile[];
  name: string;
  price: number;
  addPrice?: number;
  roomList?: string[];
}

export interface ILocation {
  postcode?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  addressDetail?: string;
}

export interface Istore {
  storeId?: number;
  category?: string;
  name?: string;
  location?: ILocation;
  tell?: {
    areaCode?: string;
    number?: string;
  };
  image?: UploadFile[];
  businessHours?: { startTime?: string; endTime?: string };
  checkTime?: { checkIn?: string; checkOut?: string };
  holiday?: { frequency?: string; day?: string[] };
  bio?: string;
  menuList?: Imenu[];
}

export interface ISendMessage {
  message: string;
  sender: number;
  userName?: string;
  roomId?: number;
}
export interface IMessage {
  chatId: number;
  senderId: string;
  senderName?: string;
  userName?: string;
  senderPic: string;
  signedUser: boolean;
  message: string;
  error?: string | null;
}

export interface IGetChatHistoryRes {
  code: string;
  data: {
    message: IMessage[];
  };
}
