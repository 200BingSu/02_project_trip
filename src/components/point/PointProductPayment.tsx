import { Button } from "antd";
import TitleHeaderTs from "../layout/header/TitleHeaderTs";
import jwtAxios from "../../apis/jwt";
import { useState } from "react";

interface advance {
  amount: number;
  strf_id: number;
}

const PointProductPayment = () => {
  const [paid, setPaid] = useState<advance>();

  const pointPaid = async () => {
    const payload = {
      amount: 10000,
      strf_id: 1,
    };
    try {
      const res = await jwtAxios.post(`payload`, payload);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div>
      <TitleHeaderTs icon="close" />

      <div>
        <div className="px-4 py-4">
          <dl className="flex items-center justify-between  mb-3">
            <dt className="text-base font-semibold text-slate-700">결제상품</dt>
            <dd className="text-base text-slate-700">홀리데인</dd>
          </dl>
          <dl className="flex items-center justify-between">
            <dt className="text-base font-semibold text-slate-700">결제금액</dt>
            <dd className="text-base text-slate-700 font-semibold">
              10,0000원
            </dd>
          </dl>
        </div>
        <section className="w-full h-[10px] bg-slate-100"></section>
        <div className="px-4">
          <dl className="flex items-center justify-between py-4 text-slate-700 border-b border-slate-100">
            <dt className="text-sm">보유 포인트</dt>
            <dd className="text-base font-semibold">10,000원</dd>
          </dl>
          <dl className="flex items-center justify-between py-4 text-slate-700 border-b border-slate-100">
            <dt className=" text-sm">사용 포인트</dt>
            <dd className="text-base font-semibold">10,000원</dd>
          </dl>
          <dl className="flex items-center justify-between py-4 text-slate-700">
            <dt className="text-sm">잔여포인트</dt>
            <dd className="text-base font-semibold">75,000원</dd>
          </dl>
        </div>
        <div className="px-4 py-4">
          <sup className="top-0 text-slate-500 text-[10px]">
            {" "}
            구매 조건에 동의하신다 결제하기를 눌러주세요.
          </sup>
          <Button
            type="primary"
            onClick={() => pointPaid()}
            className="w-full h-auto py-3 text-base"
          >
            결제하기
          </Button>
        </div>
        <sub className="px-4 text-[10px] text-slate-500 bottom-2">
          포인트 결제 시 주의사항
          <ul className="leading-3 px-3">
            <li>- 포인트는 환불이 어렵습니다.</li>
            <li>- 결제 후 취소가능 여부를 확인하세요.</li>
            <li>- 포인트 부족 시 결제가 불가능합니다.</li>
          </ul>
        </sub>
      </div>
    </div>
  );
};

export default PointProductPayment;
