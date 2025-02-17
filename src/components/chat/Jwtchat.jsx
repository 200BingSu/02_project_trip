import { Input } from "antd";
import React, { useEffect, useState } from "react";

const JwtChat = () => {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const userId = "user123"; // 로그인된 사용자 ID (실제 환경에서는 인증 시스템에서 가져옴)
  const recipientId = "user456"; // 메시지를 받을 대상

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8080/chat?userId=${userId}`);

    socket.onopen = () => console.log("WebSocket Connected");
    socket.onmessage = event => setMessages(prev => [...prev, event.data]);
    socket.onclose = () => console.log("WebSocket Disconnected");

    setWs(socket);
    return () => socket.close();
  }, []);

  const sendMessage = () => {
    if (ws && input) {
      const message = JSON.stringify({ to: recipientId, message: input });
      ws.send(message);
      setMessages(prev => [...prev, `You: ${input}`]);
      setInput("");
    }
  };

  return (
    <div>
      <h2>WebSocket Chat</h2>
      <div>
        {messages.map((msg, idx) => (
          <p key={idx}>{msg}</p>
        ))}
      </div>
      <Input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type a message..."
        onPressEnter={sendMessage}
      />
    </div>
  );
};

export default JwtChat;
