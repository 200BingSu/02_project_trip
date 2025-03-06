import { Outlet, useNavigate } from "react-router-dom";
import { getCookie } from "../../utils/cookie";
import { useEffect } from "react";
import { ROLE } from "../../types/enum";

const Layout = () => {
  const userInfo = getCookie("user");
  const { role } = userInfo;
  const navigate = useNavigate();
  const path = window.location.pathname;
  useEffect(() => {
    if (role.includes(ROLE.BUSI)) {
      navigate("/business");
    }
  }, [role]);

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
