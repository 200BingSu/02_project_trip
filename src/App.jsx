import { ConfigProvider } from "antd";
import { RouterProvider } from "react-router-dom";
import router from "./router/root";
import locale from "antd/es/locale/ko_KR";
import { getCookie } from "./utils/cookie";
import jwtAxios from "./apis/jwt";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { userAtom } from "./atoms/userAtom";

const App = () => {
  const accessToken = getCookie("accessToken");
  //recoil
  const [userInfo, setUserInfo] = useRecoilState(userAtom);

  // 유저 정보 담기
  const getUserInfo = async () => {
    try {
      const res = await jwtAxios.get("/api/user/userInfo");
      // console.log("app.jsx getUserInfo", res.data);
      const resultData = res.data;
      if (resultData) {
        setUserInfo({
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
  console.log("userInfo", userInfo);
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
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};
export default App;
