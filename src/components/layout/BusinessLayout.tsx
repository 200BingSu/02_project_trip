import { Outlet } from "react-router-dom";

const BusinessLayout = () => {
  //navigate
  //   const navigate = useNavigate();
  // 사업자가 아니라면 로그인으로 보내기
  //   const userInfo = getCookie("user");
  //   const { role } = userInfo;
  //   if (role[0] !== "business") {
  //     return navigate("/signin");
  //   }
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default BusinessLayout;
