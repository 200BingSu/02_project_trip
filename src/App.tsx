import { ConfigProvider, message } from "antd";
import locale from "antd/es/locale/ko_KR";
import axios from "axios";
import { useEffect, useRef } from "react";
import { RouterProvider } from "react-router-dom";
import { useRecoilState } from "recoil";
import { tsUserAtom } from "./atoms/tsuserAtom";
import router from "./router/root";
import { Iuser } from "./types/interface";
import { getCookie } from "./utils/cookie";
import { EventSourcePolyfill } from "event-source-polyfill";

interface IgetUserInfo {
  code: string;
  data: Iuser;
}

const App = () => {
  const accessToken = getCookie("accessToken");
  //recoil
  const [tsUserInfo, setTsUserInfo] = useRecoilState(tsUserAtom);

  // API 유저 정보 호출
  const getUserInfo = async (): Promise<IgetUserInfo | null> => {
    try {
      const res = await axios.get<IgetUserInfo>(`/api/user/userInfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const resultData = res.data;
      // console.log("유저 정보 조회", resultData);
      if (resultData.code === "200 성공") {
        setTsUserInfo({
          ...tsUserInfo,
          ...resultData.data,
          role: resultData.data.role,
        });
      }
      return resultData;
    } catch (error) {
      console.log("유저 정보 조회", error);
      return null;
    }
  };
  // console.log("tsUserInfo", tsUserInfo);

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

    eventSourceRef.current = eventSource; // 여기서 SSE 인스턴스 저장!

    eventSource.onopen = () => console.log("SSE 연결 성공!");
    eventSource.onmessage = event => console.log("새 알림:", event.data);
    eventSource.onerror = error => {
      console.error("SSE 연결 오류:", error);
      setTimeout(() => {
        eventSourceRef.current = new EventSourcePolyfill("/api/notice", {
          headers: { Authorization: `Bearer ${accessToken}` },
          heartbeatTimeout: 3600000,
        });
      }, 5000);
    };

    return () => {
      console.log("언마운트: SSE 연결 닫기");
      eventSourceRef.current?.close(); // 언마운트될 때 연결 닫기
    };
  }, [accessToken]);

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
