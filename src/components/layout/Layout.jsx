import { Outlet } from "react-router-dom";

const Layout = () => {
  const path = window.location.pathname;
  return (

    <div className="max-w-[768px] min-w-xs mx-auto relative h-screen ">

      {/* {path === "/" ? <MainHeader /> : <Header />} */}
      <div>
        <Outlet />
      </div>
    </div>
  );
};
export default Layout;
