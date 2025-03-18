import { Outlet, useLocation, useNavigate } from "react-router-dom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import { getCookie } from "../../../utils/cookie";
import { ROLE } from "../../../types/enum";

const Announcement = () => {
  // 쿠키
  const userInfo = getCookie("user");
  const role = userInfo.role[0];
  // location
  const location = useLocation();
  const pathName = location.pathname;
  //navigate
  const navigate = useNavigate();

  const navigateToBack = () => {
    if (role === ROLE.USER || ROLE.GUEST) {
      if (pathName === "/announcement") {
        navigate("/");
      } else {
        navigate(-1);
      }
    }
    if (role === ROLE.BUSI) {
      if (pathName === "/announcement") {
        navigate("/business");
      } else {
        navigate(-1);
      }
    }
  };
  return (
    <div className="max-w-[768px] min-w-xs mx-auto relative min-h-screen flex flex-col">
      <TitleHeaderTs
        icon={pathName === "/announcement" ? "close" : "back"}
        title="공지사항"
        onClick={navigateToBack}
      />
      <Outlet />
    </div>
  );
};

export default Announcement;
