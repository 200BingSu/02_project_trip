import { Button, Checkbox, Radio } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtAxios from "../../apis/jwt";
import { IAPI, IRemainPoint } from "../../types/interface";
import TitleHeaderTs from "../layout/header/TitleHeaderTs";

const PointPayment = (): JSX.Element => {
  const [selectedPoint, setSelectedPoint] = useState<IRemainPoint>();
  const [selectedCardId, setSelectedCardId] = useState<string>();
  const [isChecked, setIsChecked] = useState(false);

  const PointPayment = async () => {
    try {
      const res = await jwtAxios.get<IAPI<IRemainPoint>>("/api/point/card");
      setSelectedPoint(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePayment = async (): Promise<void> => {
    try {
      const res = await jwtAxios.post<IAPI<string>>("/api/point/card/buy", {
        pointCardId: selectedCardId,
        amount: selectedPrice,
      });

      if (res.data.data) {
        window.open(res.data.data, "_self");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    PointPayment();
  }, []);

  const navigate = useNavigate();
  const navPoint = () => {
    navigate("/user/point");
  };

  const selectedPrice = selectedPoint?.pointCards.find(
    card => card.pointCardId === selectedCardId,
  )?.finalPayment;

  const isAllSelected = selectedCardId && isChecked;

  console.log(selectedCardId);
  console.log(selectedPrice);

  return (
    <div>
      <TitleHeaderTs icon="" title="포인트 충전" onClick={navPoint} />
      <div className="py-3 px-4 border-b-[10px] border-slate-100">
        <div>
          <h2 className="text-lg font-semibold text-slate-700 ml-1 mb-3">
            충전 포인트
          </h2>
          <div className="px-3 py-4 border-[1px] border-slate-200 rounded-lg flex items-center justify-between mb-3">
            <p className="text-base text-slate-700">현재 포인트</p>
            <p className="text-base text-primary font-semibold">
              {selectedPoint?.remainPoints.toLocaleString()}P
            </p>
          </div>
          <Radio.Group
            className="custom-radio"
            value={selectedCardId}
            onChange={e => setSelectedCardId(e.target.value)}
            options={selectedPoint?.pointCards.map(point => ({
              value: point.pointCardId,
              label: (
                <div className="flex items-center justify-between text-base text-slate-700 py-4">
                  <p>{point.available.toLocaleString()}P</p>
                  <p>{point.finalPayment.toLocaleString()}원</p>
                </div>
              ),
            }))}
          />
        </div>
      </div>
      <div className="pt-3 px-4 border-b-[10px] border-slate-100">
        <h2 className="text-lg font-semibold text-slate-700 mb-3">결제정보</h2>
        <div className="py-4 flex items-center justify-between mb-3">
          <p className="text-base text-slate-700 font-semibold">결제 금액</p>
          <p className="text-base text-primary font-semibold">
            {selectedPrice ? `${selectedPrice.toLocaleString()}원` : "0원"}
          </p>
        </div>
      </div>
      <div className="py-3 px-4 border-b-[10px] border-slate-100">
        <h2 className="text-lg font-semibold text-slate-700 ml-1 mb-3">
          결제수단
        </h2>
        <div className="px-3 py-4 border-[1px] border-slate-200 rounded-lg flex items-center justify-between mb-3">
          <Radio
            defaultChecked
            className="custom-payment-radio text-base text-slate-700"
          >
            <div className="flex items-center gap-3">
              <img
                src="/images/payment/payment_icon_yellow_small.png"
                alt="payment_icon_yellow_small"
                className="w-[60px]"
              />
              <span>카카오페이</span>
            </div>
          </Radio>
        </div>
        <div className="bg-slate-50 p-5 rounded-lg">
          <p className="text-lg text-slate-700 mb-[6px]">결제혜택</p>
          <p className="text-sm text-slate-500 tracking-tight">
            본 프로모션은 카카오페이 계정 기준 "기간 내 1회, 카카오페이머니
            결제"에 한해 페이포인트 적립 가능합니다. - 포인트 적립은 장바구니
            합산 기준으로 최종 결제 금액 4만원 이상 시 자동 적립되며, 카카오페이
            톡채널로 안내됩니다. (기간 내 누적 결제금액이 아닌 단건 결제에 한함)
            - 기간 내 선착순 3천명 대상으로 예산 소진 시 별도 고지 없이 조기
            종료 될 수 있습니다. - 예산 소진 시 페이포인트 적립 메세지가
            발송되지 않습니다. - 포인트 사용 유효기간은 적립일로부터
            60개월입니다. - 적립된 포인트는 카카오페이 제휴 가맹점에서 사용
            가능합니다.
          </p>
        </div>
      </div>
      <div className="py-3 px-4">
        <h2 className="text-lg font-semibold text-slate-700 ml-1 mb-3">
          취소정책 및 이용 동의
        </h2>
        <Checkbox
          className="custom-payment-checkbox w-full text-base rounded-lg my-4 text-slate-700"
          checked={isChecked}
          onChange={e => setIsChecked(e.target.checked)}
        >
          주문 내용과 아래 유의 사항을 확인하였으며 결제 진행에 동의합니다.
        </Checkbox>
        <Button
          type="primary"
          disabled={!isAllSelected}
          onClick={handlePayment}
          className="w-full text-base py-3 !h-auto"
        >
          결제하기
        </Button>
        <p className="mt-3 text-sm text-slate-500">
          • 본 약관은 주식회사 카카오페이(이하 "회사"라 합니다)가 제공하는
          카카오페이 서비스의 이용과 관련하여 회사와 회원 사이의 권리, 의무 및
          책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
        </p>
      </div>
    </div>
  );
};

export default PointPayment;
