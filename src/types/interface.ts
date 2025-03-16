import { UploadFile } from "antd";
import { Dayjs } from "dayjs";
import { ReactNode } from "react";
import { ProviderType } from "./enum";

// children
export interface Ichildren {
  children?: React.ReactNode;
}

/**
 * ### API 응답용 인터페이스
 * @param T res.data의 타입/인터페이스
 * @example
 * interface dataType {
 *  strfId:number,
 *  name:string
 * }
 * const res = await axios.get<IAPI<dataType[]>>('/api/strf/list');
 * const data = res.data.data; // data: dataType[]의 형태
 * console.log(data);
 */
export interface IAPI<T> {
  code: string;
  data: T;
}

export interface StrfDtosType {
  strfId: string;
  title: string;
  category: string;
  busiNum: string[];
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
  strfDtos?: StrfDtosType[];
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
  openCheckIn: string;
  closeCheckIn: string;
  recomCapacity: number;
  maxCapacity: number;
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
  state: number;
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
  duration?: { startAt?: string; endAt?: string };
  checkTime?: { checkIn?: string; checkOut?: string };
  holiday?: { frequency?: string; day?: string[] };
  bio?: string;
  detail?: string;
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
  amenity_id?: number;
  amenityId?: number;
  key?: string;
  amenityTitle?: string;
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

export interface IStrf extends Partial<IRoom> {
  strfId?: string;
  category: string;
  strfTitle: string;
  latit: number;
  longitude: number;
  address: string;
  post: string;
  tell: string;
  areaCode?: string;
  startAt: null | string | Dayjs;
  endAt: null | string | Dayjs;
  openCheck: string | Dayjs;
  closeCheck: string | Dayjs;
  detail: string;
  busiNum: string;
  locationName: string;
  state: number;
  cid?: null | number;
  hostProfilePic: string;
  hostName: string;
  inquiredAt: string;
  wishCnt: number;
  ratingAvg: number;
  reviewCnt: string;
  wishIn: number;
  recentCheck: number;
  recentCheckStatus: number;
  strfPics: { strfId: string; strfPic: string }[];
  restDate: (number | string)[];
  amenity: number[];
}

export interface IRoom {
  maxCapacity: number;
  recomCapacity: number;
  surcharge: number;
  title: string;
  menuId: string;
  roomId: number;
  roomNum: number;
}

export interface ISchedule {
  seq: number;
  day: number;
  time: number | null;
  distance: number | null;
  strf_id: number;
  trip_id: number;
  path_type: string | null;
}

export interface ISelectPath {
  totalTime?: number;
  totalDistance?: number;
  path_type?: string;
}

export interface IBooking {
  bookingId: string;
  strfId: string;
  title: string;
  picName: string;
  totalPayment: number;
  state: string;
  checkInDate: string;
  checkOutDate: string;
  checkInTime: string;
  checkOutTime: string;
}

export interface IPoint {
  strfId: number;
  menuId: number;
  title: string;
  amount: number;
  usedAt: string | Dayjs;
  refund: boolean;
}
