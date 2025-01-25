import { Outlet } from "react-router-dom";
import SignupType from "../../components/signup/SignupType";

const SignUpIndex = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full px-[122px] py-[101px] gap-[30px]">
      {/* 타이틀 */}
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-[36px] font-bold line-height-[140%]">회원가입</h1>
        <p className="text-[18px] font-light line-height-[150%] text-slate-500">
          특별한 여행의 시작, 여기에서 시작하세요!
        </p>
      </div>
      {/* 선택지 */}
      <div className="flex flex-col items-center justify-center gap-[20px] w-full">
        <SignupType type="user" btcolor="primary" />
        <SignupType type="business" btcolor="purple" />
      </div>
    </div>
  );
};
export default SignUpIndex;
