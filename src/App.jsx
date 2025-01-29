import { ConfigProvider } from "antd";
import { RouterProvider } from "react-router-dom";
import router from "./router/root";
import locale from "antd/es/locale/ko_KR";

const App = () => {
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
