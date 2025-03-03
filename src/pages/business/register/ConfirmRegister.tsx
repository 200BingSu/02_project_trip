import { Button } from "antd";
import { BiCheck } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";

const ConfirmRegister = (): JSX.Element => {
  const navigate = useNavigate();
  const navigateToBusiness = () => {
    navigate("/business");
  };

  return (
    <div>
      <TitleHeaderTs
        title="업체 등록"
        icon="close"
        onClick={navigateToBusiness}
      />
      <div className="px-4 pt-5 pb-11 flex flex-col gap-14">
        <div className="flex flex-col gap-8 items-center justify-center">
          <div className="aspect-square w-[12vw] max-w-[80px] bg-primary rounded-full flex justify-center items-center">
            <BiCheck className="text-5xl text-primary2 font-semibold" />
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <p className="text-4xl font-bold text-slate-700">입점 신청 완료!</p>
            <p className="text-xl font-medium text-slate-400 text-center">
              입력한 정보는 검토 후 승인되며,
              <br /> 승인 후 QUADRUPLE에 노출됩니다.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Button
            type="primary"
            className="max-h-[60px] h-[16vw] font-semibold text-xl"
          >
            신청 내역 보러가기
          </Button>
          <button
            type="button"
            className="text-slate-400 text-sm font-medium underline"
            onClick={navigateToBusiness}
          >
            메인으로 이동하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRegister;
