import { ConfigProvider } from "antd";
import locale from "antd/es/locale/ko_KR";

import { RouterProvider } from "react-router-dom";
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
