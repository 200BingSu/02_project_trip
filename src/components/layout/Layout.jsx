import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import MainHeader from "./header/MainHeader";
import Footer from "./footer/Footer";
import DockBar from "./DockBar/DockBar";

const Layout = () => {
  const path = window.location.pathname;
  return (
    <div className="max-w-3xl mx-auto  relative h-screen flex flex-col">
      {/* {path === "/" ? <MainHeader /> : <Header />} */}
      <div className="flex-1">
        <Outlet />
      </div>
      <DockBar />
    </div>
  );
};
export default Layout;
