import { Button } from "antd";
import DockBar from "../components/layout/DockBar/DockBar";
import axios from "axios";
import { CONTENT, SEARCH, TRIP, USER, WISHLIST } from "../constants/api";
import { removeCookie } from "../utils/cookie";
import { useRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";

const Index = () => {
  // recoil
  const [userInfo, setUserInfo] = useRecoilState(userAtom);
  // useNavigate
  const navigate = useNavigate();
  const handleNavigateLogin = () => {
    navigate(`/signin`);
  };

  // 로그아웃
  const logout = () => {
    removeCookie("accessToken");
    setUserInfo({});
    handleNavigateLogin();
  };
  return (
    <div>
      메인화면
      <DockBar />
    </div>
  );
};
export default Index;
