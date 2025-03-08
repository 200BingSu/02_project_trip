import { UploadFile } from "antd";
import { ReactNode } from "react";
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
  userId: number;
  role: string[];
  tell?: string;
  accessToken: string;
  busiNum?: string;
  strfId?: string;
  title?: string;
  category?: string;
}

export interface ICoupon {
  couponId?: number;
  strfId?: number;
  title?: string;
  expiredAt?: string;
  discountPer?: number;
  distributeAt?: string;
  daysLeft?: number;
}

// 메뉴 목록
export interface MenuType {
  menuId: number;
  menuPrice: number;
  menuTitle: string;
  menuPic: string;
  strfId: number;
}

// 등록할 때
export interface Imenu {
  strfId?: number;
  menuId?: number;
  menuPic?: UploadFile[];
  name?: string;
  menuTitle?: string;
  price?: number;
  menuPrice?: number;
  addPrice?: number;
  roomList?: string[];
  recomCapacity?: number;
  maxCapacity?: number;
}

export interface ILocation {
  postcode?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  addressDetail?: string;
  locationDetailId?: number;
}

export interface Istore {
  strfId?: number;
  category?: string;
  name?: string;
  location?: ILocation;
  locationTitle?: string;
  tell?: {
    areaCode?: string;
    number?: string;
  };
  image?: UploadFile[];
  businessHours?: { startTime?: string; endTime?: string };
  checkTime?: { checkIn?: string; checkOut?: string };
  holiday?: { frequency?: string; day?: string[] };
  bio?: string;
  amenity?: number[];
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

export interface IChatList {
  roomId: string;
  title: string;
  latestChat: string;
  lastChatTime: string;
  pic: string;
  unreadChat: number;
}

export interface Iamenity {
  amenity_id: number;
  key?: string;
  icon?: ReactNode;
}

export interface IReview {
  reviewId?: number;
  review_id?: number;
  strfId?: number;
  strf_id?: number;
  strfTitle?: string;
  strf_title?: string;
  state: number;
  reviewCnt: number;
  wishCnt: number;
  ratingAvg: number;
  created_at?: string;
  createdAt?: string;
  content: string;
  rating: number;
  user_id?: number;
  userId?: number;
  userName?: string;
  writerUserId: string;
  writerUserName: string;
  writerUserProfilePic?: string;
  writerUserPic?: string;
  providerType: number;
  userWriteReviewCnt: number;
  reviewWriteDate: string;
  reviewPic?: { pic: string }[];
  reviewPicList?: { title: string }[];
  more: boolean;
}

export interface IBusinessReview {
  reviewReply: string | null;
}
