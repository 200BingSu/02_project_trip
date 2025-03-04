import NewChat from "../components/chat/NewChat";

(window as any).global = window;

const Test = () => {
  return (
    <div>
      <NewChat />

      {/* <Chat /> */}
    </div>
  );
};

export default Test;
