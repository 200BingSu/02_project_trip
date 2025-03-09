import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ROLE } from "../../types/enum";
import { getCookie } from "../../utils/cookie";
import CenterModalTs from "../common/CenterModalTs";
import { AiFillWechat } from "react-icons/ai";

const BusinessLayout = () => {
  //navigate
  const navigate = useNavigate();
  const navigateToLogin = () => {
    navigate("/signin");
  };
  const navigateToChat = () => {
    navigate("/chat?type=business");
  };
  //useState
  const [isOpenModal, setIsOpenModal] = useState(false);
  //사업자가 아니라면 로그인으로 보내기
  const userInfo = getCookie("user") ?? {};
  // console.log(userInfo);
  const { role } = userInfo;

  const hanldeClickSubmit = () => {
    navigateToLogin();
  };
  useEffect(() => {
    if (role && role.includes(ROLE.BUSI) === false) {
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
      {/* 채팅 여부 버튼 */}
      <div className="sticky bottom-0 right-0 flex justify-end p-10 pointer-events-none">
        <button
          className="aspect-square w-12 flex items-center justify-center
                            bg-primary text-white rounded-full shadow-lg py-2 text-2xl pointer-events-auto"
          onClick={navigateToChat}
        >
          <AiFillWechat />
        </button>
      </div>
    </div>
  );
};

export default BusinessLayout;
