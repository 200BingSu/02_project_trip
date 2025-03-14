import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getCookie } from "../../utils/cookie";
import { useEffect } from "react";
import { ROLE } from "../../types/enum";
import { useRecoilValue } from "recoil";
import { tsUserAtom } from "../../atoms/tsuserAtom";
import { moveTop } from "../../utils/moveTo";

const Layout = () => {
  const userInfo = getCookie("user") ?? {};
  const { role } = userInfo;
  // console.log(role);
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;
  useEffect(() => {
    if (role && role.length > 0 && role.includes(ROLE.BUSI)) {
      navigate("/business");
    }
  }, []);
  useEffect(() => {
    moveTop();
  }, [pathName]);

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
