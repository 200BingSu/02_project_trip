import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";

const Waiting = () => {
  //useNavigate
  const navigate = useNavigate();
  const LoadingCss = {
    position: "fixed",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    background: "rgba(255, 255, 255, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  };
  return (
    <div style={LoadingCss} className="flex flex-col gap-[30px]">
      <PulseLoader color="#0DD1FD" speedMultiplier={0.8} />
      <p>결제 대기중입니다.</p>
      <p>결제 완료 후 버튼을 클릭해주세요.</p>
      <Button onClick={() => navigate("/")}>다음</Button>
    </div>
  );
};

export default Waiting;
