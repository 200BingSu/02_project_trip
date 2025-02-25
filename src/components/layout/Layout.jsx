import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import MainHeader from "./header/MainHeader";
import Footer from "./footer/Footer";
import DockBar from "./DockBar/DockBar";

const Layout = () => {
  const path = window.location.pathname;
  return (
    <div className="w-full max-w-3xl min-w-xs mx-auto relative h-screen xxs:text-[10px] xs:text-[12px] sm:text-[14px] md:text-[16px] xxs:bg-slate-500 xs:bg-slate-400 sm:bg-slate-300 md:bg-slate-200">
      {/* {path === "/" ? <MainHeader /> : <Header />} */}
      <div className="">
        <Outlet />
      </div>
      <DockBar />
    </div>
  );
};
export default Layout;
