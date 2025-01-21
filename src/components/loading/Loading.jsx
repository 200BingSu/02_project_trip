import React from "react";
import PulseLoader from "react-spinners/PulseLoader";

const Loading = () => {
  const LoadingCss = {
    position: "fixed",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  };
  return (
    <div style={LoadingCss}>
      <PulseLoader color="#0DD1FD" speedMultiplier={0.8} />
    </div>
  );
};

export default Loading;
