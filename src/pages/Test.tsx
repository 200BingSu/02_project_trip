(window as any).global = window;

import JwtChat from "../components/chat/jwtchat";
import StompChat from "../components/chat/StompChat";

const Test = () => {
  return (
    <div>
      <JwtChat />
      <StompChat />
    </div>
  );
};

export default Test;
