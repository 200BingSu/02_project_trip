import { ConfigProvider } from "antd";
import { RouterProvider } from "react-router-dom";
import router from "./router/root";
import locale from "antd/es/locale/ko_KR";
import { getCookie } from "./utils/cookie";
import jwtAxios from "./apis/jwt";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { userAtom } from "./atoms/userAtom";
import { tsUserAtom } from "./atoms/tsuserAtom";
import axios from "axios";

const App = () => {
  const accessToken = getCookie("accessToken");
  //recoil
  const [userInfo, setUserInfo] = useRecoilState(userAtom);
  const [tsUserInfo, setTsUserInfo] = useRecoilState(tsUserAtom);

  // 유저 정보 담기
  const getUserInfo = async () => {
    try {
      const res = await axios.get("/api/user/userInfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // console.log("app.jsx getUserInfo", res.data);
      const resultData = res.data;
      console.log("App.jsx getUserInfo", resultData);
      if (resultData.code === "200 성공") {
        setUserInfo({
          email: resultData.data.email,
          name: resultData.data.name,
          profilePic: resultData.data.profilePic,
        });
        setTsUserInfo({
          email: resultData.data.email,
          name: resultData.data.name,
          profilePic: resultData.data.profilePic,
        });
      }
    } catch (error) {
      console.log("getUserInfo error", error);
    }
  };
  useEffect(() => {
    if (accessToken) {
      getUserInfo();
    }
  }, [accessToken]);
  console.log("tsUserInfo", tsUserInfo);
  return (
    <ConfigProvider
      locale={locale}
      theme={{
        token: {
          colorPrimary: "#0DD1FD",
        },
        components: {
          Rate: {
            starColor: "#0DD1FD",
          },
          Steps: {
            colorPrimary: "#6B4AD6",
            controlItemBgActive: "#AF9DE9",
            colorTextDescription: "#666666",
            colorSplit: "#E2E8F0",
            dotSize: 8,
            dotCurrentSize: 10,
            iconSize: 32,
          },
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};
export default App;
