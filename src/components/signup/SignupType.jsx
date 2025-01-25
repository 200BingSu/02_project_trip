import { Button } from "antd";
import React from "react";
import { RiMapPinUserFill } from "react-icons/ri";
import { BsFillHouseAddFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const SignupType = ({ type = "", btcolor = "" }) => {
  // useNavigate
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(`/signup/${type}`);
  };
  return (
    <div className="w-full gap-[10px] px-[30px] py-[50px] flex flex-col items-center border border-slate-200 rounded-lg">
      {/* 로고 */}
      <div
        className="h-[76px] w-[76px] p-[20px] bg-slate-100 rounded-full 
      flex justify-center items-center text-slate-300 text-[36px]"
      >
        {type === "user" ? <RiMapPinUserFill /> : <BsFillHouseAddFill />}
      </div>
      {/* 타이틀 */}
      <div className="text-[20px] font-bold line-height-[150%]">
        {type === "user" ? "개인" : "비즈니스"} 회원
      </div>
      {/* 설명 */}
      {type === "user" ? (
        <div className="flex flex-col ustify-center items-center">
          <p className="text-[14px] font-light line-height-[150%] text-slate-400">
            나만의 여행을 계획하세요!
          </p>
          <p className="text-[14px] font-light line-height-[150%] text-slate-400">
            지금 바로 가입하고 새로운 여정을 시작해보세요.
          </p>
        </div>
      ) : (
        <div className="flex flex-col ustify-center items-center">
          <p className="text-[14px] font-light line-height-[150%] text-slate-400">
            여행 비즈니스를 성장시키세요!
          </p>
          <p className="text-[14px] font-light line-height-[150%] text-slate-400">
            파트너로 가입하여 더 많은 고객을 만나보세요.
          </p>
        </div>
      )}
      {/* 버튼 */}
      <Button
        color={btcolor}
        variant="solid"
        onClick={handleNavigate}
        className="w-full h-[60px] text-[18px] font-bold"
      >
        {type === "user" ? "개인" : "비즈니스"} 회원가입
      </Button>
    </div>
  );
};

export default SignupType;
