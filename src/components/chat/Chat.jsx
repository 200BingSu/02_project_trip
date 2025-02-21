import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

const Chat = () => {
  const url = "ws://localhost:8080/chat-join";
  const topic = "/topic/greetings";
  const app = "/app/hello";

  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: url,
      onConnect: frame => {
        console.log("Connected: ", frame);
        stompClient.subscribe(topic, message => {
          console.log("Received message:", message);
          setMessages(prev => [...prev, JSON.parse(message.body).content]);
        });
        setConnected(true);
      },
      onWebSocketError: error => {
        console.error("WebSocket error: ", error);
        setConnected(false);
      },
      onStompError: frame => {
        console.error("STOMP error: ", frame.headers["message"], frame.body);
        setConnected(false);
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
    if (client && name.trim() && connected) {
      try {
        console.log("Sending message:", name);
        client.publish({
          destination: app,
          body: JSON.stringify({ name }),
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      console.log("Cannot send message: Client not connected or name is empty");
    }
  };
  return (
    <div>
      <h2>WebSocket STOMP Client</h2>
      <div className="flex gap-5">
        <button onClick={connect} disabled={connected} className="bg-blue-500">
          Connect
        </button>
        <button
          onClick={disconnect}
          disabled={!connected}
          className="bg-red-500"
        >
          Disconnect
        </button>
      </div>

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
