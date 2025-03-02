import { useLocation, useNavigate } from "react-router-dom";
import TitleHeader from "../../../components/layout/header/TitleHeader";
import { BiCheck } from "react-icons/bi";
import { Button } from "antd";

const CompleteSingUP = () => {
  // useNavigate
  const navigate = useNavigate();
  const location = useLocation();
  const locationData = location.state;
  console.log(locationData);

  const handleNavigateClose = () => {
    navigate(`/signin`);
  };

  return (
    <div>
      <TitleHeader
        icon="close"
        title="회원가입"
        onClick={handleNavigateClose}
      />
      <div className="flex flex-col justify-center items-center gap-[30px] h-[calc(100vh-100px)]">
        <div className="flex justify-center items-center">
          <div className="w-[70px] h-[70px] bg-primary rounded-full flex justify-center items-center">
            <BiCheck className="text-[45px] text-primary2" />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-[5px]">
          <p className="text-[36px] font-bold line-height-[140%]">
            <span className="text-primary">
              {locationData ? locationData.name : "닉네임"}
            </span>
            님 환영합니다.
          </p>
          <p className="text-[24px] font-medium line-height-[140%] text-slate-400">
            회원가입이 완료되었습니다.
          </p>
        </div>
        <Button
          className="px-[20px] py-[10px] gap-[10px]"
          type="primary"
          htmlType="button"
          size="large"
          onClick={() => handleNavigateClose()}
        >
          로그인 페이지로 이동
        </Button>
      </div>
    </div>
  );
};
export default CompleteSingUP;
