import { Client } from "@stomp/stompjs";
import { Button, Input } from "antd";
import { useEffect, useState, useRef } from "react";
import { userAtom } from "../../atoms/userAtom";
import { useRecoilValue } from "recoil";
import { getCookie } from "../../utils/cookie";

interface IMessage {
  message: string;
  sender: number;
  roomId: number;
}

const Chat = (): JSX.Element => {
  // 쿠키
  const accessToken = getCookie("accessToken");
  // useState
  const [client, setClient] = useState<Client | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [name, setName] = useState<number>(1);
  const [messages, setMessages] = useState<(IMessage | string)[]>([]);
  const [roomId, setRoomId] = useState<number>(1);
  const [inputMessage, setInputMessage] = useState<string>("");
  const connectionRef = useRef<boolean>(false);
  useEffect(() => {
    console.log("connectionRef", connectionRef.current);
  }, [connectionRef]);
  useEffect(() => {
    console.log("messages", messages);
  }, [messages]);

  //recoil
  const { userId } = useRecoilValue(userAtom);
  //임시
  useEffect(() => {
    if (userId !== 0) {
      setName(userId);
    }
    setRoomId(1);
  }, []);
  // 커넥션
  // const url = `ws://localhost:8080/chat`;
  const url = `ws://112.222.157.157:5231/chat`;
  // 구독 경로
  const topic = `/sub/chat/${roomId}`;

  // const app = "/app/hello";

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: url,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: async frame => {
        console.log("Connected: ", frame);
        stompClient.subscribe(
          topic,
          message => {
            console.log("받은 메세지:", message);
            try {
              const receivedMessage = JSON.parse(message.body);
              console.log("파싱된 메세지:", receivedMessage);
              setMessages(prev => [...prev, receivedMessage.content]);
            } catch (error) {
              // JSON이 아닌 일반 텍스트 메시지 처리
              console.log("일반 텍스트 메시지:", message.body);
              setMessages(prev => [...prev, message.body]);
            }
          },
          {
            Authorization: `Bearer ${accessToken}`,
          },
        );
        setConnected(true);
        // stompClient를 직접 사용
        try {
          await stompClient.publish({
            destination: "/pub/chat.join",
            body: JSON.stringify({
              roomId: roomId,
              sender: name,
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
    setClient(stompClient);

    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.unsubscribe(topic);
      }
    };
  }, []);
  // 클라이언트 연결 활성화
  const connect = (): void => {
    if (client) {
      client.activate();
    }
    connectionRef.current = true;
  };
  // 클라이언트 연결 종료
  const disconnect = (): void => {
    if (client && client.connected) {
      // 클라이언트가 존재하고 연결된 상태인지 확인
      console.log("연결 해제");
      client.unsubscribe(topic);
      setConnected(false);
      setMessages([]);
    }
    connectionRef.current = false;
  };
  // 채팅방 생성
  // 채팅 내역 불러오기
  // 채팅방 입장 함수(현재 과거 채팅 조회 없음)
  const joinRoom = async (): Promise<void> => {
    console.log(client, name, connected);
    if (client && name && connected) {
      try {
        client.publish({
          destination: "/pub/chat.join",
          body: JSON.stringify({
            roomId: roomId,
            sender: name,
          }),
        });
        console.log("채팅방 입장 성공");
      } catch (error) {
        console.error("Error joining room:", error);
      }
    } else {
      console.log("참여 불가: 커넥트 끊김 또는 이름 입력 없음");
    }
  };

  // 채팅 메시지 전송 함수
  const sendMessage = (): void => {
    if (client && inputMessage.trim() && connected) {
      try {
        console.log("Sending message:", inputMessage);
        client.publish({
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
        // 메시지를 즉시 화면에 표시
        // setMessages(prev => [
        //   ...prev,
        //   { message: inputMessage, sender: name, roomId: roomId },
        // ]);
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

      {/* 채팅 인터페이스 (연결된 경우에만 표시) */}
      <div
        style={{ display: connected ? "block" : "none" }}
        className="flex flex-col gap-5"
      >
        <ul className="bg-gray-100 h-96 overflow-y-auto">
          {messages.map((item: IMessage | string, index) => {
            return (
              <li key={index}>
                {typeof item === "string"
                  ? item
                  : `${item?.sender}: ${item?.message}`}
              </li>
            );
          })}
        </ul>
        {/* 메시지 입력 필드 추가 */}
        <Input
          type="text"
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          placeholder="메세지 입력"
          onPressEnter={e => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <Button onClick={sendMessage}>전송</Button>
      </div>
    </div>
  );
};

export default Chat;
