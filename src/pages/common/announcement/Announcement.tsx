import { Outlet, useLocation, useNavigate } from "react-router-dom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";

const Announcement = () => {
  // location
  const location = useLocation();
  const pathName = location.pathname;
  //navigate
  const navigate = useNavigate();
  const navigateToBack = () => {
    if (pathName === "/announcement") {
      navigate("/business");
    } else {
      navigate(-1);
    }
  };
  return (
    <div>
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
