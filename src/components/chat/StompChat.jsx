import React, { useState, useEffect } from "react";
import Stomp from "stompjs"; // STOMP 라이브러리
import SockJS from "sockjs-client"; // SockJS 라이브러리

const StompChat = () => {
  const [messages, setMessages] = useState([]); // 채팅 메시지 저장
  const [messageInput, setMessageInput] = useState(""); // 메시지 입력 상태
  const [stompClient, setStompClient] = useState(null); // STOMP 클라이언트
  const [username, setUsername] = useState(""); // 사용자의 이름
  const [isNameSet, setIsNameSet] = useState(false); // 이름이 설정되었는지 여부

  const sender = username; // 사용자의 이름을 sender로 설정

  useEffect(() => {
    // 웹 소켓 연결 설정은 한번만 실행되도록
    if (!stompClient) {
      const socket = new SockJS("http://localhost:8081/test/ws-stomp");
      const client = Stomp.over(socket);

      client.connect({}, () => {
        // 연결 완료 시 작업 수행
        setStompClient(client);

        // 구독할 채팅방의 roomId 설정
        const roomId = "teest"; // 원하는 채팅방 ID로 설정. 임의로 정한 ID

        client.subscribe(`/sub/Chat/room/${roomId}`, message => {
          const newMessage = JSON.parse(message.body);
          setMessages(prevMessages => [...prevMessages, newMessage]);
          console.log(newMessage);
        });
      });
    }

    return () => {
      if (stompClient) {
        // 연결이 끊길 때 로컬 스토리지의 사용자 이름 삭제
        localStorage.removeItem("username");
        stompClient.disconnect();
      }
    };
  }, [stompClient]); // stompClient가 변경될 때만 실행

  useEffect(() => {
    // 메시지에 show 클래스 추가
    const messageElements = document.querySelectorAll(".message");
    messageElements.forEach(element => {
      setTimeout(() => {
        element.classList.add("show");
      }, 10);
    });
  }, [messages]);

  const sendMessage = () => {
    // 메시지를 서버로 보내는 함수
    if (stompClient) {
      const roomId = "teest"; // 원하는 채팅방 ID로 설정
      const message = {
        type: "TALK", // 메시지 타입
        roomId,
        sender: sender, // sender로 사용자의 이름
        message: messageInput,
        time: new Date(), // 시간 설정
      };
      stompClient.send(`/pub/Chat/message`, {}, JSON.stringify(message));
      setMessageInput("");
    }
  };
  //(서버에서 config.setApplicationDestinationPrefixes("/pub")와 @MessageMapping("/Chat/message")로 설정해두었기 때문에)
  const handleNameSubmit = () => {
    localStorage.setItem("username", username);
    setIsNameSet(true);

    // 입장 메시지 전송
    if (stompClient) {
      const roomId = "teest"; // 원하는 채팅방 ID로 설정
      const joinMessage = {
        type: "JOIN",
        roomId: roomId,
        sender: username,
        time: new Date(), // 시간 설정
      };
      stompClient.send(`/pub/Chat/message`, {}, JSON.stringify(joinMessage));
    }
  };

  return (
    <div>
      {/* 이름 설정 모달 */}
      {!isNameSet && (
        <div className="modal">
          <div className="modal-content">
            <h2>Enter your name</h2>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <button onClick={handleNameSubmit}>Submit</button>
          </div>
        </div>
      )}

      {/* 채팅 메시지 출력 */}
      <div>
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg.sender || "알 수 없음"}: {msg.message} ({msg.time})
          </div>
        ))}
      </div>

      {/* 메시지 입력 폼 */}
      <div className="input-container">
        <input
          type="text"
          value={messageInput}
          onChange={e => setMessageInput(e.target.value)}
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
};

export default StompChat;
