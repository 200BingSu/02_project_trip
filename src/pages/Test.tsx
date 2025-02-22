import StompChat from "../components/chat/StompChat";

(window as any).global = window;

const Test = () => {
  return (
    <div>
      {/* <JwtChat /> */}
      <StompChat />
      {/* <Chat /> */}
      {/* <>
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
      </> */}
    </div>
  );
};

export default Test;
