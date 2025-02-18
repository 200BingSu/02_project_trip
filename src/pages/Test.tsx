import { Button, message, Steps, theme } from "antd";
import JwtChat from "../components/chat/Jwtchat";
import StompChat from "../components/chat/StompChat";
import { useState } from "react";

(window as any).global = window;

const steps = [
  {
    title: "First",
    content: "First-content",
  },
  {
    title: "Second",
    content: "Second-content",
  },
  {
    title: "Last",
    content: "Last-content",
  },
  {
    title: "Last",
    content: "Last-content",
  },
];

const Test = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState<number>(0);

  const onChange = (value: number) => {
    console.log("onChange:", value);
    setCurrent(value);
  };
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map(item => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <div>
      {/* <JwtChat />
      <StompChat /> */}
      <>
        <Steps
          current={current}
          items={items}
          onChange={onChange}
          progressDot
        />
        <div className="w-full h-full bg-slate-100 px-8">
          {steps[current].content}
        </div>
        <div
          style={{
            marginTop: 24,
          }}
        >
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && <Button type="primary">Done</Button>}
          {current > 0 && (
            <Button
              style={{
                margin: "0 8px",
              }}
              onClick={() => prev()}
            >
              Previous
            </Button>
          )}
        </div>
      </>
    </div>
  );
};

export default Test;
