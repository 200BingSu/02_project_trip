import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import MainHeader from "./header/MainHeader";
import Footer from "./footer/Footer";

const Layout = () => {
  const path = window.location.pathname;
  return (
    <div className="max-w-3xl mx-auto relative overflow: hidden;">
      {/* {path === "/" ? <MainHeader /> : <Header />} */}
      <div>
        <Outlet />
      </div>
      {/* <Footer /> */}
    </div>
  );
};
export default Layout;
