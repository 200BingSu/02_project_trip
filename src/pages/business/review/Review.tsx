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
  console.log("strfId", strfId);

  // useNavigate
  const navigate = useNavigate();
  const navigateToHome = () => {
    navigate("/business");
  };
  const navigateToEdit = () => {
    navigate(-1);
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
        icon={pathname === "/business/review" ? "close" : "back"}
      />
      <Outlet />
    </div>
  );
};

export default Review;
