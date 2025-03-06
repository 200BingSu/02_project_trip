import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";

const Review = (): JSX.Element => {
  // 쿼리
  const [searchParams] = useSearchParams();
  const strfId = Number(searchParams.get("strfId"));

  // useNavigate
  const navigate = useNavigate();
  const navigateToHome = () => {
    navigate("/business");
  };
  const navigateToEdit = () => {
    navigate(`/business/review?strfId=${strfId}`);
  };
  // useLocation
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <div>
      <TitleHeaderTs
        title="리뷰 관리"
        onClick={
          pathname === "/business/review/edit" ? navigateToEdit : navigateToHome
        }
      />
      <Outlet />
    </div>
  );
};

export default Review;
