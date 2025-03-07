import { Client as StompClient } from "@stomp/stompjs";
import { atom } from "recoil";
import { IMessage } from "../types/interface";

/**
 * StompClient
 * connect: 서버에 연결 시도
 * disconnect: 서버 연결 해제
 * subscribe: 특정 주제에 메시지 구독
 * publish: 특정 주제에 메시지 발행
 * unsubscribe: 특정 주제에 대한 구독 취소
 */
interface ChatState {
  stompClient: StompClient | null;
  isConnected: boolean;
  currentRoomId?: string;
  messages?: (IMessage | string)[];
}

export const chatAtom = atom<ChatState>({
  key: "chat",
  default: {
    stompClient: null,
    isConnected: false,
    currentRoomId: "",
    messages: [],
  },
});

export interface IChatData {
  chatId: string;
  senderName: string;
  senderId: string;
  senderPic: string;
  signedUser: boolean;
  message: string;
  title: string;
  createdAt: string;
}

export const chatDataAtom = atom<IChatData[]>({
  key: "chatData",
  default: [],
});
