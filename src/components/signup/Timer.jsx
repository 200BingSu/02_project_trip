import { useEffect, useState } from "react";
import moment from "moment/moment";

const count = 300;

const Timer = () => {
  // useState
  const [time, setTime] = useState(300);

  // 초를 보고 있기
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => prev - 1);
      console.log("아직도 진행중");
    }, 1000);
    return () => clearInterval(timer);
  }, [time]);
  // 0초에 알림
  useEffect(() => {
    if (time < 0) {
      alert("Time OVER!");
    }
  }, [time]);

  // moment로 포멧
  const timeText = moment.utc(time * 1000).format("mm:ss");

  return (
    <div className="text-primary" style={{}}>
      {timeText}
    </div>
  );
};
export default Timer;
