import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";
import { useEffect, useRef, useState } from "react";
import { getCookie } from "../../utils/cookie";

// 알림 컴포넌트 정의
const NotificationComponent = ({ token }: { token: string }) => {
  // 쿠키에서 액세스 토큰 가져오기
  const accessToken = getCookie("accessToken");

  // 새로운 알림이 있는지 여부를 관리하는 상태
  const [redCoin, setRedCoin] = useState(false);

  // EventSource 객체 선택 (폴리필 사용 가능)
  const EventSource = EventSourcePolyfill || NativeEventSource;

  // 이벤트 소스 참조 저장 (SSE 연결 관리)
  const eventSource = useRef<null | EventSource>(null);

  useEffect(() => {
    // 액세스 토큰이 없는 경우 SSE 연결을 하지 않음
    if (!accessToken) {
      return;
    }

    // SSE(Server-Sent Events) 연결 설정 함수
    const fetchSSE = () => {
      eventSource.current = new EventSource(`/api/notice`, {
        headers: {
          Authorization: `Bearer ${token}`, // 인증을 위한 헤더 설정
          Connetction: "keep-alive", // 연결 유지 설정 (오타: Connection이 올바름)
          Accept: "text/event-stream", // SSE 응답을 받기 위한 헤더
          "Cache-Control": "no-cache", // 캐시 방지 설정
        },
        withCredentials: true, // 인증 정보를 포함하여 요청
      });

      // 기본 메시지 이벤트 리스너 설정
      eventSource.current.onmessage = event => {
        console.log("새로운 알림:", event.data); // 새로운 메시지를 콘솔에 출력
      };

      // 특정 이벤트("exist unread notice") 수신 시 처리
      eventSource.current.addEventListener("exist unread notice", event => {
        console.log("안 읽은 알림 존재:", event.data);
        setRedCoin(true); // UI에 알림 표시 (빨간 점 활성화)
      });

      // 에러 발생 시 처리 (연결 종료 및 재연결)
      eventSource.current.onerror = async () => {
        eventSource.current?.close(); // 기존 연결 종료
        setTimeout(fetchSSE, 3600000); // 1시간 후 재연결 시도
      };

      // 연결이 성공적으로 열렸을 때 실행 (현재는 빈 함수)
      eventSource.current.onopen = () => {};
    };

    fetchSSE(); // SSE 연결 시작

    // 컴포넌트 언마운트 시 SSE 연결 해제
    return () => {
      eventSource.current?.close();
    };
  }, [eventSource]);

  return (
    <div>
      {/* 새로운 알림이 있는 경우 빨간 점 표시 */}
      {redCoin && (
        <span className="absolute top-[1px] right-[1px] w-[6px] h-[6px] bg-secondary3 border-2 border-white box-content rounded-full" />
      )}
    </div>
  );
};

export default NotificationComponent;
