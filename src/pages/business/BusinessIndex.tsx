import { Button, Checkbox, Form, Popover, Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { ISalesAtom, salesAtom } from "../../atoms/salesAtom";
import { tsUserAtom } from "../../atoms/tsuserAtom";
import Graph from "../../components/business/main/Graph";
import MainHeader from "../../components/layout/header/MainHeader";
import { salesSelector, SortSalesData } from "../../selectors/salesSelector";
import { ORDER_TYPE, ROLE } from "../../types/enum";
import { getCookie } from "../../utils/cookie";
import { TbTriangleFilled, TbTriangleInvertedFilled } from "react-icons/tb";
import { FaFilter } from "react-icons/fa";

// interface
export interface IGraphData {
  x: string | number;
  y: number;
}

const BusinessIndex = (): JSX.Element => {
  //useNavigate
  const navigate = useNavigate();
  const navigateToMypage = () => {
    if (userInfo.role.includes(ROLE.BUSI)) {
      navigate("/business/mypage");
    } else {
      navigate("/user/mypage");
    }
  };

  //쿠키
  const userInfo = getCookie("user");
  // console.log("userInfo", userInfo);
  const accessToken = getCookie("accessToken");
  // recoil
  const [_, setSalesData] = useRecoilState(salesAtom);
  const recoilUserData = useRecoilValue(tsUserAtom);
  const filteredSalesData = useRecoilValue(salesSelector);
  const ascSalesData = useRecoilValue(SortSalesData("asc"));
  const descSalesData = useRecoilValue(SortSalesData("desc"));

  const defaultFilter = filteredSalesData[0].data.map(item => item.x);

  //useState
  const [period, setPeriod] = useState<number>(ORDER_TYPE.Y1);
  const [sort, setSort] = useState<string>("desc");
  const [filter, setFilter] = useState<(string | number)[]>(defaultFilter);
  // 매출표

  // API 매출 현황
  const getSales = async (): Promise<ISalesAtom | null> => {
    const url = "/api/business/my-page/sales";
    try {
      const res = await axios.get<ISalesAtom>(`${url}?orderType=${period}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("매출 현황", res.data);
      setSalesData(res.data);
      return res.data;
    } catch (error) {
      console.log("매출 현황", error);
      return null;
    }
  };

  // 기간 포멧
  const formatPeriod = (period: number): string | undefined => {
    switch (period) {
      case ORDER_TYPE.M1:
        return "1개월";
      case ORDER_TYPE.M3:
        return "3개월";
      case ORDER_TYPE.M6:
        return "6개월";
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

  // 총 매출액
  const totalSales = filteredSalesData[0].data.reduce<number>(
    (acc, curr) => acc + curr.y,
    0,
  );

  useEffect(() => {
    getSales();
  }, [period]);

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };

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
        <section className="select-none pb-4">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-semibold text-slate-600 ">
              매출 현황
            </h2>
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
          <Graph data={filteredSalesData} />
        </section>
        {/* 매출 표 */}
        <section className="select-none">
          <h3 className="text-lg font-medium text-slate-700 py-3">매출 표</h3>
          <div className="grid grid-cols-[1fr_2fr] border border-slate-200 rounded-lg overflow-hidden">
            {/* 헤더 */}
            <div className="relative flex items-center justify-center gap-5 bg-slate-50 text-slate-600 text-base p-3 font-medium border-b  text-center border-r border-slate-200">
              <p className="text-base">기간</p>
              <div className="absolute right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSort(sort === "asc" ? "desc" : "asc");
                  }}
                  className="text-xs "
                >
                  <TbTriangleFilled
                    className={`${sort === "asc" ? "text-primary" : "text-slate-400"}`}
                  />
                  <TbTriangleInvertedFilled
                    className={`${sort === "desc" ? "text-primary" : "text-slate-400"}`}
                  />
                </button>
                <Popover
                  title="필터"
                  placement="bottom"
                  trigger="click"
                  content={
                    <>
                      <Form
                        name="checkFilter"
                        onFinish={onFinish}
                        initialValues={{
                          "checkbox-group": defaultFilter,
                        }}
                      >
                        <Form.Item name="checkbox-group">
                          <Checkbox.Group className="flex flex-col gap-2">
                            {defaultFilter.map(item => (
                              <Checkbox
                                value={item}
                                style={{
                                  lineHeight: "32px",
                                }}
                              >
                                {item}
                              </Checkbox>
                            ))}
                          </Checkbox.Group>
                        </Form.Item>
                        <Form.Item className="flex items-center gap-2">
                          <Button
                            type="default"
                            onClick={() => {
                              setFilter(defaultFilter);
                            }}
                          >
                            초기화
                          </Button>
                          <Button type="primary" htmlType="submit">
                            적용
                          </Button>
                        </Form.Item>
                      </Form>
                    </>
                  }
                >
                  <button type="button" className="text-sm text-slate-400">
                    <FaFilter />
                  </button>
                </Popover>
              </div>
            </div>
            <div className="bg-slate-50 text-slate-600 text-base p-3 font-medium border-b border-slate-200">
              매출
              <button type="button">오름차순/내림차순</button>
            </div>
            {/* 데이터 행 */}
            {sort === "asc"
              ? ascSalesData.map(item => (
                  <>
                    <div className="p-3 text-sm text-slate-600 border-b last:border-b-0 text-center border-r border-slate-200">
                      {item.x}
                    </div>
                    <div className="p-3 text-sm text-slate-600 border-b border-slate-200 last:border-b-0">
                      {item.y.toLocaleString()}원
                    </div>
                  </>
                ))
              : descSalesData.map(item => (
                  <>
                    <div className="p-3 text-sm text-slate-600 border-b last:border-b-0 text-center border-r border-slate-200">
                      {item.x}
                    </div>
                    <div className="p-3 text-sm text-slate-600 border-b border-slate-200 last:border-b-0">
                      {item.y.toLocaleString()}원
                    </div>
                  </>
                ))}
          </div>
        </section>
      </div>
    </div>
  );
};
export default BusinessIndex;
