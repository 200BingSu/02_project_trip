import { Popover, Select } from "antd";
import { useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { tsUserAtom } from "../../atoms/tsuserAtom";
import Graph from "../../components/business/main/Graph";
import MainHeader from "../../components/layout/header/MainHeader";
import { salesMockData } from "../../mock/Sales";
import { ORDER_TYPE, ROLE } from "../../types/enum";
import { getCookie } from "../../utils/cookie";

// interface
export interface IGraphData {
  x: string | number;
  y: number;
}

const BusinessIndex = (): JSX.Element => {
  //쿠키
  const userInfo = getCookie("user");
  console.log("userInfo", userInfo);

  // recoil
  const recoilUserData = useRecoilValue(tsUserAtom);

  //useState
  const [period, setPeriod] = useState<number>(ORDER_TYPE.Y1);

  //useNavigate
  const navigate = useNavigate();
  const navigateToMypage = () => {
    if (userInfo.role.includes(ROLE.BUSI)) {
      navigate("/business/mypage");
    } else {
      navigate("/user/mypage");
    }
  };

  // 기간 포멧
  const formatPeriod = (period: number): string | undefined => {
    switch (period) {
      case ORDER_TYPE.M1:
        return "1달";
      case ORDER_TYPE.M3:
        return "3달";
      case ORDER_TYPE.M6:
        return "6달";
      case ORDER_TYPE.Y1:
        return "1년";
    }
  };

  // 기간 선택 옵션
  const PeriodArr = [
    {
      label: formatPeriod(ORDER_TYPE.M1),
      value: ORDER_TYPE.M1,
    },
    {
      label: formatPeriod(ORDER_TYPE.M3),
      value: ORDER_TYPE.M3,
    },
    {
      label: formatPeriod(ORDER_TYPE.M6),
      value: ORDER_TYPE.M6,
    },
    {
      label: formatPeriod(ORDER_TYPE.Y1),
      value: ORDER_TYPE.Y1,
    },
  ];

  //기간 변경
  const handleChangePeriod = (e: any) => {
    setPeriod(Number(e));
  };
  // 매출 데이터 형식 변경
  const formatSalesData = (data: any) => {
    const salesData = Object.entries(data).map(([x, y]) => ({
      x: x,
      y: Number(y),
    }));
    return [
      {
        id: "매출액",
        data: salesData,
      },
    ];
  };
  // 그래프용 데이터 형식 변경 (10000 단위로 변경)
  const formatGraphData = formatSalesData(salesMockData).map(item => {
    return {
      id: item.id,
      data: item.data.map(data => ({
        x: data.x,
        y: Number(data.y) / 10000,
      })),
    };
  });
  // 그래프에 넣을 데이터
  const salesGraphData = formatGraphData;
  // 총 매출액
  const totalSales = formatSalesData(salesMockData)[0].data.reduce(
    (acc, curr) => acc + curr.y,
    0,
  );
  return (
    <div>
      <MainHeader onClick={navigateToMypage} />
      <div className="px-4 py-5 flex flex-col gap-3">
        {/* 입금 예정 금액 */}
        <section className="py-3">
          <h3 className="text-lg font-medium text-slate-700 select-none">
            {recoilUserData.name} 사장님의 {formatPeriod(period)} 동안 입금 예정
            금액
          </h3>
          <div className="flex items-center gap-3 select-none">
            <p className="text-2xl text-primary font-semibold">
              {totalSales.toLocaleString()}원
            </p>
            <Popover
              placement="right"
              content={"* 매출로 분류된 금액을 기준으로 산정됩니다."}
              trigger="hover"
            >
              <span>
                <AiOutlineQuestionCircle className="text-lg text-slate-300 cursor-help" />
              </span>
            </Popover>
          </div>
        </section>
        {/* 그래프 */}
        <section className="select-none">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-semibold text-slate-600">매출 현황</h2>
            <Select
              placeholder="기간 선택"
              onChange={e => {
                console.log(e);
                handleChangePeriod(e);
              }}
              className="flex items-center w-28"
              defaultValue={"1년"}
              options={PeriodArr.map(item => ({
                label: item.label || "",
                value: item.value.toString(),
              }))}
            />
          </div>
          <Graph data={salesGraphData} />
        </section>
      </div>
    </div>
  );
};
export default BusinessIndex;
