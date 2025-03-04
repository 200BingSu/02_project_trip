import Chat from "../components/chat/Chat";

(window as any).global = window;

const Test = () => {
  return (
    <div>
      {/* <NewChat /> */}

      <Chat />
    </div>
  );
};

export default Test;
