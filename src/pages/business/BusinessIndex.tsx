import { Button, Checkbox, Popover, Select } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FaFilter } from "react-icons/fa";
import { RiArrowGoBackFill } from "react-icons/ri";
import { TbTriangleFilled, TbTriangleInvertedFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { ISalesAtom, salesAtom } from "../../atoms/salesAtom";
import { tsUserAtom } from "../../atoms/tsuserAtom";
import Graph from "../../components/business/main/Graph";
import MainHeader from "../../components/layout/header/MainHeader";
import {
  salesSelector,
  SortSalesData,
  SortSalesDataBySales,
} from "../../selectors/salesSelector";
import { ORDER_TYPE, ROLE } from "../../types/enum";
import { getCookie } from "../../utils/cookie";

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
  const [, setSalesData] = useRecoilState(salesAtom);
  const recoilUserData = useRecoilValue(tsUserAtom);
  const filteredSalesData = useRecoilValue(salesSelector);
  const ascSalesData = useRecoilValue(SortSalesData("asc"));
  const descSalesData = useRecoilValue(SortSalesData("desc"));
  const ascSalesDataBySales = useRecoilValue(SortSalesDataBySales("asc"));
  const descSalesDataBySales = useRecoilValue(SortSalesDataBySales("desc"));

  // useState
  const [filter, setFilter] = useState<(number | string)[]>([]);
  const [sortingType, setSortingType] = useState<"period" | "sales">("period");
  const [period, setPeriod] = useState<number>(ORDER_TYPE.Y1);
  const [sort, setSort] = useState<string>("desc");
  const [, setCheckboxValues] = useState<(string | number)[]>(
    descSalesData.map(item => item.x),
  );

  // 초기 filter 설정을 위한 useEffect
  useEffect(() => {
    if (sortingType === "period") {
      if (sort === "asc") {
        setFilter(ascSalesData.map(item => item.x));
      } else {
        setFilter(descSalesData.map(item => item.x));
      }
    } else {
      if (sort === "asc") {
        setFilter(ascSalesDataBySales.map(item => item.x));
      } else {
        setFilter(descSalesDataBySales.map(item => item.x));
      }
    }
  }, [descSalesData, ascSalesData, ascSalesDataBySales, descSalesDataBySales]);

  // 정렬 변경 시 filter 업데이트
  useEffect(() => {
    if (sortingType === "period") {
      if (sort === "asc") {
        setFilter(ascSalesData.map(item => item.x));
      } else {
        setFilter(descSalesData.map(item => item.x));
      }
    } else {
      if (sort === "asc") {
        setFilter(ascSalesDataBySales.map(item => item.x));
      } else {
        setFilter(descSalesDataBySales.map(item => item.x));
      }
    }
  }, [sort, sortingType]);

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

  return (
    <div>
      <MainHeader onClick={navigateToMypage} />
      <div className="px-4 py-5 flex flex-col gap-3">
        {/* 입금 예정 금액 */}
        <section className="py-3">
          <h3 className="text-lg font-medium text-slate-700 select-none">
            <span className="text-slate-700 text-xl ">
              {recoilUserData.name}
            </span>{" "}
            사장님네{" "}
            <span className="text-slate-700 text-xl ">{userInfo.title}</span>의{" "}
            {formatPeriod(period)} 동안 입금 예정 금액
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
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSort(sort === "asc" ? "desc" : "asc");
                    setSortingType("period");
                  }}
                  className="text-xs "
                >
                  <TbTriangleFilled
                    className={`transition-all duration-300 ${sort === "asc" && sortingType === "period" ? "text-primary" : "text-slate-400"}`}
                  />
                  <TbTriangleInvertedFilled
                    className={`transition-all duration-300 ${sort === "desc" && sortingType === "period" ? "text-primary" : "text-slate-400"}`}
                  />
                </button>
                <Popover
                  title="필터"
                  placement="bottom"
                  trigger="hover"
                  content={
                    <div>
                      <Checkbox.Group
                        className="flex flex-col gap-2"
                        value={filter}
                        onChange={checkedValues => {
                          setCheckboxValues(checkedValues as string[]);
                          setFilter(checkedValues as string[]);
                        }}
                      >
                        {descSalesData.map(item => (
                          <Checkbox
                            key={item.x}
                            value={item.x}
                            style={{
                              lineHeight: "32px",
                            }}
                          >
                            {item.x}
                          </Checkbox>
                        ))}
                      </Checkbox.Group>
                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          type="default"
                          onClick={() => {
                            setFilter(descSalesData.map(item => item.x));
                            setCheckboxValues(
                              descSalesData.map(item => item.x),
                            );
                          }}
                        >
                          전체 선택
                        </Button>
                        <Button
                          type="default"
                          onClick={() => {
                            setFilter([]);
                            setCheckboxValues([]);
                          }}
                        >
                          <RiArrowGoBackFill className="text-slate-300" />
                          초기화
                        </Button>
                      </div>
                    </div>
                  }
                >
                  <button type="button" className="text-sm text-slate-400">
                    <FaFilter />
                  </button>
                </Popover>
              </div>
            </div>
            <div className="relative bg-slate-50 text-slate-600 text-base p-3 font-medium border-b border-slate-200">
              매출
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSort(sort === "asc" ? "desc" : "asc");
                    setSortingType("sales");
                  }}
                  className="text-xs "
                >
                  <TbTriangleFilled
                    className={`transition-all duration-300 ${sort === "asc" && sortingType === "sales" ? "text-primary" : "text-slate-400"}`}
                  />
                  <TbTriangleInvertedFilled
                    className={`transition-all duration-300 ${sort === "desc" && sortingType === "sales" ? "text-primary" : "text-slate-400"}`}
                  />
                </button>
              </div>
            </div>
            {/* 데이터 행 */}
            {sort === "asc" &&
              sortingType === "period" &&
              ascSalesData.map(item => (
                <React.Fragment key={item.x}>
                  <div
                    className={`p-3 text-sm text-slate-600 border-b last:border-b-0 text-center border-r border-slate-200
                      ${filter.includes(item.x) ? "" : "hidden"}`}
                  >
                    {item.x}
                  </div>
                  <div
                    className={`p-3 text-sm text-slate-600 border-b border-slate-200 last:border-b-0
                      ${filter.includes(item.x) ? "" : "hidden"}`}
                  >
                    {item.y.toLocaleString()}원
                  </div>
                </React.Fragment>
              ))}
            {sort === "desc" &&
              sortingType === "period" &&
              descSalesData.map(item => (
                <React.Fragment key={item.x}>
                  <div
                    className={`p-3 text-sm text-slate-600 border-b last:border-b-0 text-center border-r border-slate-200
                      ${filter.includes(item.x) ? "" : "hidden"}`}
                  >
                    {item.x}
                  </div>
                  <div
                    className={`p-3 text-sm text-slate-600 border-b border-slate-200 last:border-b-0
                      ${filter.includes(item.x) ? "" : "hidden"}`}
                  >
                    {item.y.toLocaleString()}원
                  </div>
                </React.Fragment>
              ))}
            {sort === "asc" &&
              sortingType === "sales" &&
              ascSalesDataBySales.map(item => (
                <React.Fragment key={item.x}>
                  <div
                    className={`p-3 text-sm text-slate-600 border-b last:border-b-0 text-center border-r border-slate-200
                      ${filter.includes(item.x) ? "" : "hidden"}`}
                  >
                    {item.x}
                  </div>
                  <div
                    className={`p-3 text-sm text-slate-600 border-b border-slate-200 last:border-b-0
                      ${filter.includes(item.x) ? "" : "hidden"}`}
                  >
                    {item.y.toLocaleString()}원
                  </div>
                </React.Fragment>
              ))}
            {sort === "desc" &&
              sortingType === "sales" &&
              descSalesDataBySales.map(item => (
                <React.Fragment key={item.x}>
                  <div
                    className={`p-3 text-sm text-slate-600 border-b last:border-b-0 text-center border-r border-slate-200
                      ${filter.includes(item.x) ? "" : "hidden"}`}
                  >
                    {item.x}
                  </div>
                  <div
                    className={`p-3 text-sm text-slate-600 border-b border-slate-200 last:border-b-0
                      ${filter.includes(item.x) ? "" : "hidden"}`}
                  >
                    {item.y.toLocaleString()}원
                  </div>
                </React.Fragment>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};
export default BusinessIndex;
