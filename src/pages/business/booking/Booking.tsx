import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import StrfInfo from "../../../components/business/StrfInfo";

const Booking = (): JSX.Element => {
  // 쿼리
  const [searchParams] = useSearchParams();
  const strfId = searchParams.get("strfId");
  // useNavigate
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;

  const navigateToBack = () => {
    pathName === "/business/booking"
      ? navigate("/business")
      : navigate(`/business/booking?strfId=${strfId}`);
  };
  return (
    <div>
      <TitleHeaderTs icon="back" title="예약 관리" onClick={navigateToBack} />
      {/* <StrfInfo /> */}
      <Outlet />
    </div>
  );
};

export default Booking;
