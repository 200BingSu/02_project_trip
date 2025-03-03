import { Client } from "@stomp/stompjs";
import { Button, Input } from "antd";
import { useEffect, useRef, useState } from "react";
import { getCookie } from "../utils/cookie";
import TitleHeaderTs from "../components/layout/header/TitleHeaderTs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BsFillPatchPlusFill } from "react-icons/bs";
import jwtAxios from "../apis/jwt";

interface ISendMessage {
  message: string;
  sender: number;
  userName?: string;
  roomId?: number;
  createdAt?: string;
  error?: string | null;
}
interface IMessage {
  chatId: number;
  senderId: string;
  senderName?: string;
  userName?: string;
  senderPic: string;
  signedUser: boolean;
  message: string;
  error?: string | null;
}
interface IGetChatHistoryRes {
  code: string;
  data: {
    message: IMessage[];
  };
}
// 더미 데이터
const dummyresponse = {
  code: "200 성공",
  data: {
    message: [
      {
        chatId: 1,
        senderId: "550e8400-e29b-41d4-a716-446655440000",
        senderName: "user1",
        senderPic: "image.jpg",
        signedUser: true, // 로그인 유저 인지
        message: "나야 들기름",
      },
      {
        chatId: 1,
        senderId: "65f26e0e-e982-4182-830a-47c4edd38cf2",
        senderName: "user2",
        senderPic: "image.jpg",
        signedUser: false,
        message: "니가 누군데",
      },
    ],
  },
};
const dummyResultData = dummyresponse.data;
const dummyMessageArr: IMessage[] = dummyResultData.message;

const ChatRoom = (): JSX.Element => {
  // 쿠키
  const accessToken = getCookie("accessToken");
  // useNavigate
  const navigate = useNavigate();
  const navigateToBack = () => {
    navigate(-1);
  };
  // 쿼리
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  // useState & useRef
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [name, setName] = useState<number>(1);
  const [messages, setMessages] = useState<(ISendMessage | string)[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const connectionRef = useRef<boolean>(false);

  useEffect(() => {
    console.log("connectionRef", connectionRef.current);
  }, [connectionRef]);
  useEffect(() => {
    console.log("messages", messages);
  }, [messages]);

  //쿠키
  const userInfo = getCookie("user");
  const userId = userInfo?.userId;
  //임시
  useEffect(() => {
    if (userId !== 0) {
      setName(userId);
    }
  }, []);

  // api 채팅내역
  const getChatHistory = async (): Promise<IGetChatHistoryRes | null> => {
    try {
      const res = await jwtAxios.get<IGetChatHistoryRes>(`/api/chat/history`);
      const resultData = res.data;
      console.log("채팅내역", resultData);
      return resultData;
    } catch (error) {
      console.log("채팅내역 조회 실패", error);
      return null;
    }
  };
  useEffect(() => {
    getChatHistory();
  }, []);

  // 커넥션
  // const url = `ws://localhost:8080/chat`;
  const url = `ws://112.222.157.157:5231/chat`;
  // 구독 경로
  const topic = `/sub/chat/${roomId}`;
  useEffect(() => {
    const stompClient = new Client({
      brokerURL: url,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      // 연결 성공
      onConnect: async frame => {
        console.log("Connected: ", frame);
        stompClient.subscribe(
          topic,
          message => {
            console.log("받은 메세지:", message);
            try {
              const receivedMessage = JSON.parse(message.body);
              console.log("파싱된 메세지:", receivedMessage);
              setMessages(prev => [...prev, receivedMessage]);
            } catch (error) {
              console.log("일반 텍스트 메시지:", message.body);
              setMessages(prev => [...prev, message.body]);
            }
          },
          {
            Authorization: `Bearer ${accessToken}`,
          },
        );
        setConnected(true);
        connectionRef.current = true;
        //바로 방 입장
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
      },
      // 연결 해제
      onDisconnect: () => {
        console.log("Disconnected");
        connectionRef.current = false;
        setConnected(false);
        setMessages(prev => [...prev, "연결이 끊어졌습니다."]);
      },
      onWebSocketError: error => {
        console.error("WebSocket error: ", error);
        connectionRef.current = false;
        setConnected(false);
        setMessages(prev => [
          ...prev,
          "연결 오류가 발생했습니다. 재연결을 시도합니다.",
        ]);
      },
      onStompError: frame => {
        console.error("STOMP error: ", frame.headers["message"], frame.body);
        connectionRef.current = false;
        setConnected(false);
        setMessages(prev => [...prev, "STOMP 오류가 발생했습니다."]);
      },
    });

    clientRef.current = stompClient;

    return () => {
      if (clientRef.current && clientRef.current.connected) {
        console.log(
          "Component unmounting - Connection status:",
          clientRef.current.connected,
        );
        clientRef.current.unsubscribe(topic);
        clientRef.current.deactivate();
      }
    };
  }, []);

  // 클라이언트 연결 활성화
  const connect = (): void => {
    if (clientRef.current) {
      clientRef.current.activate();
    }
    connectionRef.current = true;
  };

  // 클라이언트 연결 종료
  const disconnect = (): void => {
    if (clientRef.current && clientRef.current.connected) {
      console.log("연결 해제");
      clientRef.current.unsubscribe(topic);
      setConnected(false);
      setMessages([]);
      connectionRef.current = false;
    }
  };

  useEffect(() => {
    connect();
  }, []);

  // 채팅 메시지 전송 함수
  const sendMessage = (): void => {
    if (clientRef.current && inputMessage.trim() && connected) {
      try {
        console.log("Sending message:", inputMessage);
        clientRef.current.publish({
          destination: "/pub/chat.sendMessage",
          body: JSON.stringify({
            roomId: roomId,
            sender: name,
            message: inputMessage,
          }),
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setInputMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      console.log("메세지 전송 오류: 커넥트 끊김 또는 메세지 입력 없음");
    }
  };

  return (
    <div>
      {/* 임시, 이후 useEffect로 처리하기 */}
      <div>
        <h2>WebSocket STOMP Client</h2>
        {/* 연결/연결해제 버튼 */}
        <div className="flex gap-5">
          {connectionRef.current ? (
            <Button
              onClick={disconnect}
              disabled={!connected}
              className="bg-red-500"
            >
              연결 해제
            </Button>
          ) : (
            <Button
              onClick={connect}
              disabled={connected}
              className="bg-blue-500"
            >
              통신 연결
            </Button>
          )}
        </div>
      </div>
      <TitleHeaderTs title="채팅" icon="back" onClick={navigateToBack} />
      {/* 채팅 인터페이스 (연결된 경우에만 표시) */}
      <div className="bg-slate-200 min-h-[calc(100vh-100px)] pt-[16px]">
        <ul
          className="h-full overflow-y-auto
        flex flex-col gap-[16px]"
        >
          {messages.map((item: ISendMessage | string, index) => {
            return (
              <li key={index}>
                {typeof item === "string"
                  ? item
                  : item.userName
                    ? `${item?.userName}가 입장합니다.`
                    : `${item?.sender}: ${item?.message}`}
              </li>
            );
          })}
          {dummyMessageArr.map((item, index) => {
            return item.signedUser === true ? (
              <li
                key={index}
                className="flex items-center justify-end gap-[12px] px-[16px]"
              >
                <div className="flex items-center gap-[6px]">
                  <p
                    className="flex items-center justify-center bg-primary px-[16px] py-[12px]
                    rounded-b-xl rounded-tl-xl
                    text-white text-sm
                    max-w-56 break-all"
                  >
                    {item.message}
                  </p>
                  {/* <p>{item.createdAt}</p> */}
                </div>
              </li>
            ) : (
              <li
                key={index}
                className="flex items-start justify-start gap-[12px] px-[16px]"
              >
                <div className="w-[30px] h-[30px] bg-slate-500 rounded-full overflow-hidden">
                  사진
                </div>
                <div className="flex flex-col gap-[6px]">
                  <p className="text-sm text-slate-700 font-semibold">
                    {item.senderName}
                  </p>
                  <div className="flex items-center gap-[6px]">
                    <p
                      className="flex items-center justify-center bg-slate-100 px-[16px] py-[12px]
                    rounded-b-xl rounded-tr-xl
                    text-slate-700 text-sm
                    max-w-56 break-all"
                    >
                      {item.message}
                    </p>
                    {/* <p>{item.createdAt}</p> */}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        {/* 메시지 입력 필드 추가 */}
        <div
          className="flex items-center gap-[12px]
                    px-[16px] py-[16px]
                    bg-white
                    max-w-[768px] w-full h-auto fixed bottom-0 left-1/2 -translate-x-1/2"
        >
          <Input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder="메세지 입력"
            onPressEnter={e => {
              if (inputMessage.trim() && e.key === "Enter") {
                sendMessage();
              }
            }}
            className="px-[16px] py-[12px]"
          />
          <button type="button" onClick={sendMessage}>
            <BsFillPatchPlusFill className="text-3xl text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
