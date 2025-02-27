import { Button } from "antd";
import React from "react";
import { RiMapPinUserFill } from "react-icons/ri";
import { BsFillHouseAddFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const SignupType = ({ type = "", btcolor = "" }) => {
  // useNavigate
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(`/signup/authentication`, {
      state: { userType: type },
    });
  };
  return (
    <div className="w-full flex flex-col items-center rounded-lg bg-white py-12 px-8 gap-3">
      {/* 로고 */}
      <div>
        {type === "user" ? (
          <img
            src="../../../public/images/signup/user_signup_img.png"
            alt="user_signup_img"
            className="w-36"
          />
        ) : (
          <img
            src="../../../public/images/signup/business_signup_img.png"
            alt="business_signup_img"
            className="w-36"
          />
        )}
      </div>
      {/* 타이틀 */}
      <div className="text-xl font-semibold text-slate-700">
        {type === "user" ? "개인" : "비즈니스"} 회원
      </div>
      {/* 설명 */}
      {type === "user" ? (
        <div>
          <p className="text-sm font-light text-slate-500 text-center">
            나만의 여행을 계획하세요! <br />
            지금 바로 가입하고 새로운 여정을 시작해보세요.
          </p>
        </div>
      ) : (
        <div>
          <p className="text-sm font-light text-slate-500 text-center">
            여행 비즈니스를 성장시키세요! <br />
            파트너로 가입하여 더 많은 고객을 만나보세요.
          </p>
        </div>
      )}
      {/* 버튼 */}
      <Button
        color={btcolor}
        variant="solid"
        onClick={handleNavigate}
        className="w-full h-auto text-lg font-semibold py-4"
      >
        {type === "user" ? "개인" : "비즈니스"} 회원가입
      </Button>
    </div>
  );
};

export default SignupType;
