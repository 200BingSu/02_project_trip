import JwtChat from "../components/chat/Jwtchat";
import StompChat from "../components/chat/StompChat";

(window as any).global = window;

const Test = () => {
  return (
    <div>
      <JwtChat />
      <StompChat />
    </div>
  );
};

export default Test;
