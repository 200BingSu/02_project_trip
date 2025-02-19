import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

const Chat = () => {
  const url = "ws://localhost:8080/spring-boot-tutorial";
  const topic = "/topic/greetings";
  const app = "/api/hello";

  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: url,
      onConnect: frame => {
        setConnected(true);
        console.log("Connected: ", frame);
        stompClient.subscribe(topic, message => {
          setMessages(prev => [...prev, JSON.parse(message.body).content]);
        });
      },
      onWebSocketError: error => console.error("WebSocket error: ", error),
      onStompError: frame => {
        console.error("STOMP error: ", frame.headers["message"], frame.body);
      },
    });
    setClient(stompClient);

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, []);

  const connect = () => {
    if (client) {
      client.activate();
    }
  };

  const disconnect = () => {
    if (client) {
      client.deactivate();
      setConnected(false);
      setMessages([]);
    }
  };

  const sendMessage = () => {
    if (client && name.trim()) {
      client.publish({
        destination: app,
        body: JSON.stringify({ name }),
      });
    }
  };
  return (
    <div>
      <h2>WebSocket STOMP Client</h2>
      <button onClick={connect} disabled={connected} className="bg-blue-500">
        Connect
      </button>
      <button onClick={disconnect} disabled={!connected} className="bg-red-500">
        Disconnect
      </button>
      <div style={{ display: connected ? "block" : "none" }}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your name"
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
