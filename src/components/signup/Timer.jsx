import { useEffect, useState } from "react";
import moment from "moment/moment";
import { Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";

const count = 300;

const Timer = () => {
  //useNavigate
  const navigate = useNavigate();
  // useState
  const [time, setTime] = useState(300);
  const [intervalId, setIntervalId] = useState(null);
  const [open, setOpen] = useState(false);

  // 초를 보고 있기
  useEffect(() => {
    const id = setInterval(() => {
      setTime(prevTime => prevTime - 1); // 1초마다 time 감소
    }, 1000);
    setIntervalId(id);
    return () => clearInterval(id);
  }, []);

  // 0초에 알림
  useEffect(() => {
    if (time < 0) {
      Modal.confirm({
        title: "Confirm",
        content: (
          <div className="text-[18px] flex flex-col items-center py-[10px]">
            <p>시간을 초과했습니다.</p> <p>회원가입을 초기화합니다.</p>
          </div>
        ),
        footer: (_, { OkBtn }) => (
          <>
            <OkBtn />
          </>
        ),
        onOk() {
          navigate(`/signup/user`);
        },
      });
      if (intervalId) {
        clearInterval(intervalId); // 타이머 정지
      }
    }
  }, [time, intervalId]);

  // moment로 포멧
  const timeText = moment.utc(time * 1000).format("mm:ss");

  // modal
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <div className="text-primary absolute right-[30px] top-[60px]">
      {timeText}
    </div>
  );
};
export default Timer;
