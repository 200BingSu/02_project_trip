import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ROLE } from "../../types/enum";
import { getCookie } from "../../utils/cookie";
import CenterModalTs from "../common/CenterModalTs";

const BusinessLayout = () => {
  //navigate
  const navigate = useNavigate();
  const navigateToLogin = () => {
    navigate("/signin");
  };
  //useState
  const [isOpenModal, setIsOpenModal] = useState(false);
  //사업자가 아니라면 로그인으로 보내기
  const userInfo = getCookie("user");
  // console.log(userInfo);
  const { role } = userInfo;

  const hanldeClickSubmit = () => {
    navigateToLogin();
  };
  useEffect(() => {
    if (role.includes(ROLE.BUSI) === false) {
      console.log("사업자가 아닙니다.");
      setIsOpenModal(true);
    }
  }, []);

  return (
    <div className="max-w-[768px] min-w-xs mx-auto relative h-screen ">
      <Outlet />
      {isOpenModal && (
        <CenterModalTs
          type="warning"
          content="사업자 회원가입 후 이용 가능한 페이지입니다."
          handleClickSubmit={hanldeClickSubmit}
        />
      )}
    </div>
  );
};

export default BusinessLayout;
