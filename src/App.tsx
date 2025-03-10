import { ConfigProvider } from "antd";
import locale from "antd/es/locale/ko_KR";
import axios from "axios";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useRecoilState } from "recoil";
import { tsUserAtom } from "./atoms/tsuserAtom";
import router from "./router/root";
import { Iuser } from "./types/interface";
import { getCookie } from "./utils/cookie";

interface IgetUserInfo {
  code: string;
  data: Iuser;
}

const App = () => {
  const accessToken = getCookie("accessToken");
  // console.log(userInfo);

  //recoil
  const [tsUserInfo, setTsUserInfo] = useRecoilState(tsUserAtom);

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
            colorPrimary: "#6B4AD6",
            controlItemBgActive: "#AF9DE9",
            colorTextDescription: "#666666",
            colorSplit: "#E2E8F0",
            dotSize: 8,
            dotCurrentSize: 10,
            iconSize: 32,
          },
          Input: {
            colorTextPlaceholder: "#94A3B8",
          },
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};
export default App;
