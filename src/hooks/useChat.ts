import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { chatAtom } from "../atoms/chatAtom";
import { getCookie } from "../utils/cookie";
import { ISendMessage } from "../types/interface";
import { Client } from "@stomp/stompjs";

const useChat = (roomId: string) => {
  // 토큰 및 사용자 정보
  const accessToken = getCookie("accessToken");
  const userInfo = getCookie("user");
  const userId = userInfo?.userId;

  // recoil 상태
  const [chatState, setChatState] = useRecoilState(chatAtom);

  // 커넥션 경로 및 구독 경로
  const docker = "ws://112.222.157.157:5231";
  const url = `${docker}/chat`;
  const topic = `/sub/chat/${roomId}`;

  // subscription 관리를 위한 ref
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    let stompClient: Client | null = null;

    const connect = async () => {
      // 이전 연결이 있다면 정리
      if (chatState.stompClient) {
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }
        await chatState.stompClient.deactivate();
        setChatState(prev => ({
          ...prev,
          stompClient: null,
          isConnected: false,
        }));
      }

      // 새로운 StompClient 인스턴스 생성
      stompClient = new Client({
        brokerURL: url,
        connectHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: async frame => {
          console.log("연결: ", frame);

          // 이전 구독 해제
          if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
          }

          // 새로운 구독 설정
          const subscription = stompClient!.subscribe(
            topic,
            message => {
              console.log("받은 메세지:", message);
              try {
                const receivedMessage = JSON.parse(
                  message.body,
                ) as ISendMessage;
                console.log("파싱된 메세지:", receivedMessage);
                setChatState(prev => ({
                  ...prev,
                  messages: [
                    ...(prev.messages ?? []),
                    {
                      chatId: Date.now(),
                      senderId: receivedMessage.sender.toString(),
                      message: receivedMessage.message,
                      senderPic: "",
                      signedUser: receivedMessage.sender === userId,
                    },
                  ],
                }));
              } catch (error) {
                console.log("메시지 파싱 실패:", error);
                setChatState(prev => ({
                  ...prev,
                  messages: [
                    ...(prev.messages ?? []),
                    {
                      chatId: Date.now(),
                      senderId: "system",
                      message: message.body,
                      senderPic: "",
                      signedUser: false,
                    },
                  ],
                }));
              }
            },
            {
              Authorization: `Bearer ${accessToken}`,
            },
          );

          subscriptionRef.current = subscription;

          if (stompClient) {
            setChatState(prev => ({
              ...prev,
              stompClient,
              isConnected: true,
              currentRoomId: roomId,
            }));

            // 채팅방 입장
            try {
              await stompClient.publish({
                destination: "/pub/chat.join",
                body: JSON.stringify({
                  roomId: roomId,
                  sender: userId,
                }),
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              });
              console.log("채팅방 입장 성공");
            } catch (error) {
              console.error("Error joining room:", error);
            }
          }
        },
        onDisconnect: () => {
          console.log("Disconnected");
          setChatState(prev => ({
            ...prev,
            isConnected: false,
          }));
        },
        onWebSocketError: error => {
          console.error("WebSocket error: ", error);
          setChatState(prev => ({
            ...prev,
            isConnected: false,
          }));
        },
        onStompError: frame => {
          console.error("STOMP error: ", frame);
          setChatState(prev => ({
            ...prev,
            isConnected: false,
          }));
        },
      });

      await stompClient.activate();
    };

    connect();

    return () => {
      const cleanup = async () => {
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }
        if (stompClient) {
          await stompClient.deactivate();
        }
        setChatState({
          stompClient: null,
          isConnected: false,
          currentRoomId: "",
          messages: [],
        });
      };
      cleanup();
    };
  }, [roomId, accessToken]);

  const sendMessage = async (message: string): Promise<void> => {
    if (chatState.stompClient && message.trim() && chatState.isConnected) {
      try {
        console.log("Sending message:", message);
        await chatState.stompClient.publish({
          destination: "/pub/chat.sendMessage",
          body: JSON.stringify({
            roomId: roomId,
            sender: userId,
            message: message,
          }),
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      console.log("메세지 전송 오류: 커넥트 끊김 또는 메세지 입력 없음");
    }
  };

  return {
    messages: chatState.messages,
    sendMessage,
  };
};

export default useChat;
