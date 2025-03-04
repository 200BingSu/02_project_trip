import { Outlet, useNavigate } from "react-router-dom";
import SignupType from "../../components/signup/SignupType";
import TitleHeaderTs from "../../components/layout/header/TitleHeaderTs";

const SignUpIndex = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center w-full bg-slate-100">
      {/* 타이틀 */}
      <TitleHeaderTs
        title="회원가입"
        icon="back"
        onClick={() => navigate(-1)}
      />
      {/* 선택지 */}
      <div className="flex flex-col items-center justify-center gap-5 px-4 py-6 w-full">
        <SignupType type="user" btcolor="primary" />
        <SignupType type="business" btcolor="purple" />
      </div>
    </div>
  );
};
export default SignUpIndex;
