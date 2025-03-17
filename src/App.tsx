import { ConfigProvider } from "antd";
import locale from "antd/es/locale/ko_KR";
import axios from "axios";

import { useEffect, useRef, useCallback } from "react";
import { RouterProvider } from "react-router-dom";
import { useRecoilState } from "recoil";
import { tsUserAtom } from "./atoms/tsuserAtom";
import { hasUnreadNotificationAtom } from "./atoms/notificationAtom";
import router from "./router/root";
import { Iuser } from "./types/interface";
import { getCookie } from "./utils/cookie";
import { EventSourcePolyfill } from "event-source-polyfill";
import jwtAxios from "./apis/jwt";

interface IgetUserInfo {
  code: string;
  data: Iuser;
}

const App = () => {
  const accessToken = getCookie("accessToken");

  // Recoil 상태 관리

  const [tsUserInfo, setTsUserInfo] = useRecoilState(tsUserAtom);
  const [hasUnreadNotification, setHasUnreadNotification] = useRecoilState(
    hasUnreadNotificationAtom,
  );

  // API 유저 정보 호출

  const getUserInfo = async (): Promise<IgetUserInfo | null> => {
    try {
      const res = await axios.get<IgetUserInfo>(`/api/user/userInfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        setTsUserInfo({
          ...tsUserInfo,
          ...resultData.data,
          role: resultData.data.role,
        });
      }
      return resultData;
    } catch (error) {
      console.log("유저 정보 조회 실패:", error);
      return null;
    }
  };

  // 🔄 **알림 개수 확인 API**
  const checkUnreadNotifications = useCallback(async () => {
    if (accessToken) {
      try {
        const res = await jwtAxios.get("/api/notice/check?start_idx=0");
        const notifications = res.data.data.noticeLines;
        const hasUnread = notifications.some(
          (notice: { opened: boolean }) => !notice.opened,
        );

        console.log("🔔 새로운 알림 확인됨:", hasUnread);
        setHasUnreadNotification(hasUnread);
      } catch (error) {
        console.log("알림 확인 실패:", error);
      }
    }
  }, [accessToken, setHasUnreadNotification]);

  // SSE
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);
  useEffect(() => {
    if (!accessToken) {
      return;
    }

    if (eventSourceRef.current) {
      console.log("기존 SSE 연결 닫기");
      eventSourceRef.current.close();
    }
    const eventSource = new EventSourcePolyfill("/api/notice", {
      headers: { Authorization: `Bearer ${accessToken}` },
      heartbeatTimeout: 3600000,
    });

    eventSourceRef.current = eventSource;

    // ✅ SSE 메시지 수신 이벤트
    eventSource.onmessage = function (this: EventSource, ev: MessageEvent) {
      console.log("🔥 SSE 메시지 수신:", ev.data);

      try {
        const rawData = ev.data.trim();
        let parsedData;

        if (rawData.startsWith("{") && rawData.endsWith("}")) {
          parsedData = JSON.parse(rawData);
        } else {
          parsedData = rawData;
        }

        // ✅ 새로운 알림이 도착했을 경우 처리
        if (
          (typeof parsedData === "string" && parsedData === "true") ||
          (typeof parsedData === "object" &&
            parsedData.event === "exist unread notice" &&
            parsedData.data === true)
        ) {
          console.log("📌 새로운 미확인 알림 감지됨!");

          // ✅ **즉시 Recoil 상태 업데이트**
          setHasUnreadNotification(true);
          console.log("🔴 상태 변경 요청: setHasUnreadNotification(true);");

          // ✅ **알림 목록 강제 업데이트**
          setTimeout(() => {
            console.log("🔄 checkUnreadNotifications() 실행됨");
            checkUnreadNotifications();
          }, 100);
        }
      } catch (error) {
        console.warn("⚠️ SSE 메시지 처리 오류:", error, ev.data);
      }
    };

    // ❌ SSE 연결 오류 발생 시 자동 재연결
    eventSource.onerror = error => {
      console.error("❌ SSE 연결 오류 발생:", error);
      setTimeout(() => {
        console.log("🔄 SSE 재연결 시도...");
        eventSourceRef.current = new EventSourcePolyfill("/api/notice", {
          headers: { Authorization: `Bearer ${accessToken}` },
          heartbeatTimeout: 3600000,
        });
      }, 5000);
    };

    // ✅ 초기 알림 상태 확인
    checkUnreadNotifications();

    return () => {
      console.log("언마운트: SSE 연결 닫기");
      eventSourceRef.current?.close();
    };
  }, [accessToken, checkUnreadNotifications]);

  // ✅ 상태 변화 감지 로그
  useEffect(() => {
    console.log("🔔 hasUnreadNotification 변경됨:", hasUnreadNotification);
  }, [hasUnreadNotification]);

  console.count("SSE 메시지 수신");

  useEffect(() => {
    if (accessToken) {
      getUserInfo();
    }
  }, [accessToken]);

  return (
    <ConfigProvider
      locale={locale}
      theme={{
        token: {
          colorPrimary: "#0DD1FD",
        },
        components: {
          Button: {
            defaultBorderColor: "#CBD5E1",
          },
          Rate: {
            starColor: "#0DD1FD",
          },
          Steps: {
            colorTextDescription: "#666666",
            colorSplit: "#E2E8F0",
            dotSize: 8,
            dotCurrentSize: 10,
            iconSize: 32,
          },
          Input: {
            colorTextPlaceholder: "#94A3B8",
          },
          Notification: {
            width: 200,
            padding: 4,
            fontSize: 12,
          },
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};
export default App;
