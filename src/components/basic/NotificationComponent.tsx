import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";
import { useEffect, useRef, useState } from "react";
import { getCookie } from "../../utils/cookie";

const NotificationComponent = ({ token }: { token: string }) => {
  const accessToken = getCookie("accessToken");
  const [redCoin, setRedCoin] = useState(false);

  const EventSource = EventSourcePolyfill || NativeEventSource;
  const eventSource = useRef<null | EventSource>(null);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    const fetchSSE = () => {
      eventSource.current = new EventSource(`/api/notice`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Connetction: "keep-alive",
          Accept: "text/event-stream",
          "Cache-Control": "no-cache",
        },
        withCredentials: true,
      });

      // 기본 메시지 이벤트
      eventSource.current.onmessage = event => {
        console.log("새로운 알림:", event.data);
      };

      // "exist unread notice" 이벤트 수신
      eventSource.current.addEventListener("exist unread notice", event => {
        console.log("안 읽은 알림 존재:", event.data);
        setRedCoin(true); // 새로운 알림이 있을 경우 UI 업데이트
      });

      eventSource.current.onerror = async () => {
        eventSource.current?.close();
        // 재연결
        setTimeout(fetchSSE, 3600000);
      };

      eventSource.current.onopen = () => {};
    };

    fetchSSE();
    return () => {
      eventSource.current?.close();
    };
  }, [eventSource]);

  return (
    <div>
      {redCoin && (
        <span className="absolute top-[1px] right-[1px] w-[6px] h-[6px] bg-secondary3 border-2 border-white box-content rounded-full" />
      )}
    </div>
  );
};

export default NotificationComponent;
