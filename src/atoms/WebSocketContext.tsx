import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";

interface WebSocketContextType {
  clientRef: React.RefObject<Client | null>;
  connected: boolean;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  hasNewMessage: boolean;
  setHasNewMessage: (hasNew: boolean) => void;
}

export const WebSocketProvider = ({ children }: { children: <ReactNod></ReactNod>e }) => {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [hasNewMessage, setHasNewMessage] = useState<boolean>(false);

  // 전역에서 메시지 구독 처리
  useEffect(() => {
    if (!clientRef.current) {
      const stompClient = new Client({
        // ... 기존 설정 ...
        onConnect: () => {
          stompClient.subscribe(
            "/user/queue/messages", // 사용자별 메시지 수신용 토픽
            message => {
              // 채팅방 페이지가 아닐 때만 알림 처리
              if (!window.location.pathname.includes("/chat")) {
                setUnreadCount(prev => prev + 1);
                setHasNewMessage(true);
              }
            },
          );
        },
      });
      clientRef.current = stompClient;
      stompClient.activate();
    }

    return () => {
      if (clientRef.current?.connected) {
        clientRef.current.deactivate();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        clientRef,
        connected,
        unreadCount,
        setUnreadCount,
        hasNewMessage,
        setHasNewMessage,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
