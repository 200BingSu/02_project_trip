import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import MainHeader from "./header/MainHeader";
import Footer from "./footer/Footer";

const Layout = () => {
  const path = window.location.pathname;
  return (
    <>
      {path === "/" ? <MainHeader /> : <Header />}
      <div className="max-w-3xl mx-auto bg-slate-200">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};
export default Layout;
