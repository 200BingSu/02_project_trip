import { BiCheck } from "react-icons/bi";
import TitleHeaderTs from "../layout/header/TitleHeaderTs";
import { Button } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";

const PointComplete = (): JSX.Element => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 쿼리 파라미터에서 값 추출
  const amount = Number(searchParams.get("amount")).toLocaleString();
  const remainPoint = Number(searchParams.get("remain_point")).toLocaleString();

  return (
    <div>
      <TitleHeaderTs icon="close" title="결제 완료" />
      <div className="flex flex-col justify-center items-center gap-6 h-screen px-4">
        <div className="flex flex-col justify-center items-center gap-3">
          <h2 className="p-3 bg-primary rounded-full">
            <BiCheck className="text-4xl text-white" />
          </h2>
          <h2 className="text-xl text-slate-700 font-semibold">
            포인트 충전완료
          </h2>
        </div>
        <div>
          <div className="w-full flex flex-col gap-3 py-6 border-t border-b border-slate-100">
            <dl className="flex items-center justify-between">
              <dt className="text-base text-slate-500">충전 금액</dt>
              <dd className="text-base text-slate-700 font-semibold">
                {amount}원
              </dd>
            </dl>
            <dl className="flex items-center justify-between">
              <dt className="text-base text-slate-500">포인트 잔액</dt>
              <dd className="text-base text-slate-700 font-semibold">
                {remainPoint}원
              </dd>
            </dl>
          </div>
          <p className="text-xs tracking-tight text-slate-500 mt-3">
            * 충전된 포인트는 환불이 제한될 수 있습니다. 결제 오류 발생 시
            고객센터로 문의해 주세요.
          </p>
        </div>
        <div className="w-full flex gap-3">
          <Button
            className="w-full h-auto py-3 text-slate-500 text-base"
            onClick={() => navigate("/")}
          >
            홈으로
          </Button>
          <Button
            onClick={() => navigate("/user/point")}
            className="w-full h-auto py-3 text-base"
            type="primary"
          >
            포인트 내역
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PointComplete;
