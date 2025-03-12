import { useLocation, useNavigate } from "react-router-dom";
import TitleHeader from "../../../components/layout/header/TitleHeader";
import { BiCheck } from "react-icons/bi";
import { Button } from "antd";

const CompleteSingUP = () => {
  // useNavigate
  const navigate = useNavigate();
  const location = useLocation();
  const locationName = location.state;
  console.log(locationName);

  const handleNavigateClose = () => {
    navigate(`/signin`);
  };

  return (
    <div className="h-screen">
      <TitleHeader
        icon="close"
        title="회원가입"
        onClick={handleNavigateClose}
      />
      <div className="px-4">
        <div className="w-full h-[calc(100%-150px)]  flex flex-col justify-center items-center gap-[30px]">
          <div className="flex justify-center items-center">
            <div className="w-36 h-36 bg-primary/80 rounded-full flex justify-center items-center">
              <img
                src="https://em-content.zobj.net/source/microsoft-teams/363/party-popper_1f389.png"
                alt=""
              />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-[5px]">
            <p className="text-2xl font-semibold text-slate-700">
              <span className="text-primary">
                {locationName ? locationName.name : "회원"}
              </span>
              님 환영합니다.
            </p>
            <p className="text-base font-light text-slate-400 text-center break-keep">
              이제부터 쿼드러플에서 제공하는 다양한 서비스들을 이용해보세요
            </p>
          </div>
        </div>
        <Button
          className="w-full py-[14px] h-auto text-base"
          type="primary"
          htmlType="button"
          onClick={() => handleNavigateClose()}
        >
          홈으로 돌아가기
        </Button>
      </div>
    </div>
  );
};
export default CompleteSingUP;
