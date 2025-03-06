import { Flex, Radio } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TitleHeaderTs from "../layout/header/TitleHeaderTs";
import "../../styles/antd-styles.css";

const PointPayment = (): JSX.Element => {
  const [money, setmoney] = useState(null);
  const points = [10000, 30000, 50000, 70000, 100000];
  const navigate = useNavigate();
  const navPoint = () => {
    navigate("/user/point");
  };
  return (
    <div>
      <TitleHeaderTs icon="" title="포인트 충전" onClick={navPoint} />
      <div className="py-3 border-b-[10px] border-slate-100">
        <div>
          <h2 className="text-lg font-semibold text-slate-700 ml-1 mb-3">
            충전 포인트
          </h2>
          <div className="px-3 py-4 border-[1px] border-slate-200 rounded-lg flex items-center justify-between mb-3">
            <p className="text-base text-slate-700">현재 포인트</p>
            <p className="text-base text-primary font-semibold">6,700P</p>
          </div>
          <Radio.Group
            className="custom-radio"
            options={[
              {
                value: 1,
                label: (
                  <Flex
                    gap="small"
                    align="center"
                    vertical
                    className="text-base text-slate-700 py-4 "
                  >
                    <p>10,000P</p>
                    <p>10,000원</p>
                  </Flex>
                ),
              },
              {
                value: 2,
                label: (
                  <Flex
                    gap="small"
                    align="center"
                    vertical
                    className="text-base text-slate-700 py-4"
                  >
                    <p>30,000P</p>
                    <p>30,000P</p>
                  </Flex>
                ),
              },
              {
                value: 3,
                label: (
                  <Flex
                    gap="small"
                    align="center"
                    vertical
                    className="text-base text-slate-700 py-4"
                  >
                    <p>50,000P</p>
                    <p>50,000P</p>
                  </Flex>
                ),
              },
              {
                value: 4,
                label: (
                  <Flex
                    gap="small"
                    align="center"
                    vertical
                    className="text-base text-slate-700 py-4 "
                  >
                    <p>70,000P</p>
                    <p>70,000P</p>
                  </Flex>
                ),
              },
              {
                value: 5,
                label: (
                  <Flex
                    gap="small"
                    align="center"
                    vertical
                    className="text-base text-slate-700 py-4 "
                  >
                    <p>100,000P</p>
                    <p>100,000P</p>
                  </Flex>
                ),
              },
            ]}
          />
        </div>
      </div>
      <div className="py-3 border-b-[10px] border-slate-100">
        <h2 className="text-lg font-semibold text-slate-700 ml-1 mb-3">
          결제정보
        </h2>
        <div className="py-4 flex items-center justify-between mb-3">
          <p className="text-base text-slate-700 font-semibold">결제 금액</p>
          <p className="text-base text-primary font-semibold">10,000원</p>
        </div>
      </div>
      <div className="py-3 border-b-[10px] border-slate-100">
        <h2 className="text-lg font-semibold text-slate-700 ml-1 mb-3">
          결제수단
        </h2>
        <div className="px-3 py-4 border-[1px] border-slate-200 rounded-lg flex items-center justify-between mb-3">
          <p className="text-base text-slate-700">현재 포인트</p>
        </div>
        <div>
          <p>결제혜택</p>
          <p>
            본 프로모션은 카카오페이 계정 기준 "기간 내 1회, 카카오페이머니
            결제"에 한해 페이포인트 적립 가능합니다. - 포인트 적립은 장바구니
            합산 기준으로 최종 결제 금액 4만원 이상 시 자동 적립되며, 카카오페이
            톡채널로 안내됩니다. (기간 내 누적 결제금액이 아닌 단건 결제에 한함)
            - 기간 내 선착순 3천명 대상으로 예산 소진 시 별도 고지 없이 조기
            종료 될 수 있습니다.  - 예산 소진 시 페이포인트 적립 메세지가
            발송되지 않습니다. - 포인트 사용 유효기간은 적립일로부터
            60개월입니다. - 적립된 포인트는 카카오페이 제휴 가맹점에서 사용
            가능합니다.
          </p>
        </div>
      </div>
      <div className="py-3">
        <h2 className="text-lg font-semibold text-slate-700 ml-1 mb-3">
          취소정책 및 이용 동의
        </h2>
      </div>
    </div>
  );
};

export default PointPayment;
