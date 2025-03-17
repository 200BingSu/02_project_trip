import { ConfigProvider } from "antd";
import locale from "antd/es/locale/ko_KR";

import { RouterProvider } from "react-router-dom";
import router from "./router/root";

const App = () => {
  // const accessToken = getCookie("accessToken");

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
