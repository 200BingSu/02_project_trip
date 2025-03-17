import { Outlet, useLocation, useNavigate } from "react-router-dom";
import TitleHeader from "../../../components/layout/header/TitleHeader";

const ScheduleBoard = () => {
  // router
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;
  const navigateToBack = () => {
    pathName === "/scheduleboard" ? navigate("/") : navigate(-1);
  };
  return (
    <div>
      <TitleHeader onClick={navigateToBack} title="여행기" icon="back" />
      <Outlet />
    </div>
  );
};
export default ScheduleBoard;
