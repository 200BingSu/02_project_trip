import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import { matchName } from "../../../utils/match";
import StrfInfo from "../../../components/business/StrfInfo";

const Menu = (): JSX.Element => {
  //useNavigate
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const strfId = searchParams.get("strfId");
  const category = searchParams.get("category");
  const location = useLocation();
  const pathname = location.pathname;
  const navigateToBack = (path: string) => {
    switch (path) {
      case "/business/menu":
        navigate("/business");
        break;
      case "/business/menu/create":
        navigate(`/business/menu?strfId=${strfId}&category=${category}`);
        break;
      case "/business/menu/edit":
        navigate(`/business/menu?strfId=${strfId}&category=${category}`);
        break;
      case "/business/menu/detail":
        navigate(`/business/menu?strfId=${strfId}&category=${category}`);
        break;
    }
  };
  return (
    <div className="min-h-screen">
      <TitleHeaderTs
        title={`${matchName(category)} 관리`}
        onClick={() => navigateToBack(pathname)}
      />
      <StrfInfo />
      <Outlet />
    </div>
  );
};

export default Menu;
