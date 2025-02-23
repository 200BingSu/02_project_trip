import { Client } from "@stomp/stompjs";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { userAtom } from "../../atoms/userAtom";
import { useRecoilValue } from "recoil";

const Chat = (): JSX.Element => {
  // useState
  const [client, setClient] = useState<Client | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [name, setName] = useState<number>(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [roomId, setRoomId] = useState<string>("");
  const [inputMessage, setInputMessage] = useState<string>("");

  //recoil
  const { userId } = useRecoilValue(userAtom);
  useEffect(() => {
    setName(userId);
  }, []);
  // 커넥션
  const url = `ws://localhost:8080/chat`;
  // 구독 경로
  const topic = `/sub/chat/${roomId}`;

  // const app = "/app/hello";

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: url,
      // 자동 재연결 설정 추가
      reconnectDelay: 5000, // 5초 후 재연결 시도
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: frame => {
        console.log("Connected: ", frame);
        stompClient.subscribe(topic, message => {
          console.log("Received message:", message);
          setMessages(prev => [...prev, JSON.parse(message.body).content]);
        });
        setConnected(true);
      },
      onDisconnect: () => {
        console.log("Disconnected");
        setConnected(false);
        setMessages(prev => [...prev, "연결이 끊어졌습니다."]);
      },
      onWebSocketError: error => {
        console.error("WebSocket error: ", error);
        setConnected(false);
        setMessages(prev => [
          ...prev,
          "연결 오류가 발생했습니다. 재연결을 시도합니다.",
        ]);
      },
      onStompError: frame => {
        console.error("STOMP error: ", frame.headers["message"], frame.body);
        setConnected(false);
        setMessages(prev => [...prev, "STOMP 오류가 발생했습니다."]);
      },
    });
    setClient(stompClient);

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, []);
  // 클라이언트 연결 활성화
  const connect = (): void => {
    if (client) {
      client.activate();
    }
  };
  // 클라이언트 연결 종료
  const disconnect = (): void => {
    if (client) {
      client.deactivate();
      setConnected(false);
      setMessages([]);
    }
  };

  // 채팅방 입장 함수(현재 과거 채팅 조회 없음)
  const joinRoom = (): void => {
    // 클라이언트가 연결되어 있고, 이름이 입력되어 있는지 확인
    if (client && name && connected) {
      try {
        // /pub/chat.join 경로로 입장 메시지 발행
        client.publish({
          destination: "/pub/chat.join",
          body: JSON.stringify({
            roomId: roomId, // 채팅방 ID
            sender: name, // 입장하는 유저 이름
          }),
        });
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
      <h2>WebSocket STOMP Client</h2>
      {/* 연결/연결해제 버튼 */}
      <div className="flex gap-5">
        {connected ? (
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
      <div style={{ display: connected ? "block" : "none" }}>
        {/* 사용자 이름 입력 필드: 이후 recoil로 입력 처리하기 */}
        <div>
          <label>이름</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(Number(e.target.value))}
            placeholder="이름 입력"
          />
        </div>
        {/* 채팅방 입장 버튼 */}
        <button onClick={joinRoom}>채팅방 입장</button>

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
        <button onClick={sendMessage}>Send</button>

        <table>
          <tbody>
            {messages.map((msg, index) => (
              <tr key={index}>
                <td>{msg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Chat;
