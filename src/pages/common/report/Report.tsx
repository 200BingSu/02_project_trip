import { Outlet, useNavigate } from "react-router-dom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";

const Report = () => {
  const navigate = useNavigate();
  const navigateToBack = () => {
    navigate(-1);
  };
  return (
    <div className="max-w-[768px] min-w-xs mx-auto relative min-h-screen flex flex-col">
      <TitleHeaderTs title="신고" onClick={navigateToBack} />
      <Outlet />
    </div>
  );
};

export default Report;
