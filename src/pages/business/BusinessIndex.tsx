import { DatePicker, Popover, Table } from "antd";
import axios from "axios";
import { Dayjs } from "dayjs";
import type { PanelMode } from "rc-picker/lib/interface";
import { useEffect, useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { ISales } from "../../atoms/salesAtom";
import { tsUserAtom } from "../../atoms/tsuserAtom";
import MainHeader from "../../components/layout/header/MainHeader";
import { ROLE } from "../../types/enum";
import { IAPI } from "../../types/interface";
import { getCookie } from "../../utils/cookie";
import Footer from "../Footer";
import { mockSalesData } from "../../mock/Sales";
import Graph from "../../components/business/main/Graph";
import { SorterResult, TableCurrentDataSource } from "antd/es/table/interface";
import { TablePaginationConfig } from "antd";
import { FilterValue } from "antd/es/table/interface";

const { RangePicker } = DatePicker;

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
  const navigateToRegister = () => {
    navigate("/business/register");
  };
  //쿠키
  const userInfo = getCookie("user");
  const strfId = userInfo.strfDtos[0].strfId;
  const strfName = userInfo.strfDtos[0].title;
  const accessToken = getCookie("accessToken");
  // recoil
  const userData = useRecoilValue(tsUserAtom);
  const userName = userData.name;
  // useState
  const [salesData, setSalesData] = useState<ISales[] | null>(null);
  const [period, setPeriod] = useState<Dayjs[]>([]);
  const [_, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState<SorterResult<ISales>>({});

  // 총 매출
  const totalSales = salesData?.reduce((acc, curr) => acc + curr.totalSales, 0);

  // API 매출 현황
  const getSales = async (): Promise<IAPI<ISales[]> | null> => {
    const url = "/api/business/my-page/sales";
    try {
      const res = await axios.get<IAPI<ISales[]>>(
        `${url}?orderType=${period}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log("매출 현황", res.data);
      const resultData = res.data;
      setSalesData(resultData.data);
      return resultData;
    } catch (error) {
      console.log("매출 현황", error);
      return null;
    }
  };
  //antD
  const getYearMonth = (date: Dayjs) => date.year() * 12 + date.month();
  const disabled12MonthsDate = (
    current: Dayjs,
    info?: { type?: PanelMode; from?: Dayjs },
  ) => {
    if (info?.from) {
      const minDate = info.from.subtract(11, "months");
      const maxDate = info.from.add(11, "months");
      switch (info.type) {
        case "year":
          return (
            current.year() < minDate.year() || current.year() > maxDate.year()
          );
        default:
          return (
            getYearMonth(current) < getYearMonth(minDate) ||
            getYearMonth(current) > getYearMonth(maxDate)
          );
      }
    }
    return false;
  };

  const columns = [
    {
      title: <p className="text-center text-sm text-slate-700">기간</p>,
      dataIndex: "month",
      key: "month",
      width: "30%",
      render: (value: string) => (
        <div className="text-center text-xs text-slate-700">{value}</div>
      ),
    },
    {
      title: <p className="text-center text-sm text-slate-700">매출</p>,
      dataIndex: "totalSales",
      key: "totalSales",
      width: "70%",
      sorter: (a: ISales, b: ISales) => a.totalSales - b.totalSales,
      sortOrder:
        sortedInfo.columnKey === "totalSales" ? sortedInfo.order : null,
      render: (value: number) => (
        <div className="pr-4 text-right text-xs text-slate-700">
          {value.toLocaleString()}원
        </div>
      ),
      ellipsis: true,
    },
  ];
  const handleChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<ISales> | SorterResult<ISales>[],
  ) => {
    console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<ISales>);
  };

  useEffect(() => {
    setSalesData(mockSalesData);
  }, [period]);

  return (
    <div className="">
      <MainHeader onClick={navigateToMypage} />
      {/* 업체가 없을 경우 */}
      {!strfId && (
        <section className="px-8 py-20 flex flex-col gap-10 ">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-2xl text-slate-300 font-bold">
                <span className="text-primary">QUADRUPLE</span>이<br /> 사장님께
                제공하는 서비스는?
              </p>
              <span className="text-sm text-slate-400">
                * 해당 서비스 이용을 위해서는 업체 등록이 필요합니다
              </span>
            </div>
          </div>
          <div
            className="flex items-center px-10 bg-primary h-28 rounded-3xl relative cursor-pointer select-none"
            onClick={navigateToRegister}
          >
            <div className="flex flex-col gap-1 text-slate-50 text-2xl font-semibold">
              <p>서비스 이용을 위해</p>
              <p className="px-5 flex items-center gap-5">
                업체를 등록하세요!{" "}
                <i>
                  <IoIosArrowForward />
                </i>
              </p>
            </div>
            <div className="aspect-square w-24 absolute -top-1 right-8">
              <img
                src="/images/emoji/mail.png"
                alt="아이콘"
                className="w-full h-full rotate-12"
              />
            </div>
          </div>
        </section>
      )}
      {/* 업체가 있을 경우 */}
      {strfId && (
        <section className="px-4 py-5 flex flex-col gap-3">
          {/* 그래프 */}
          <div className="select-none">
            <Graph data={salesData ?? []} />
            {/* 입금 예정 금액 */}
            <div>
              <h3 className="text-xl font-semibold text-slate-700 select-none">
                {userName} 사장님의 {strfName} 매출
              </h3>
            </div>
          </div>
          {/* 매출 표 */}
          <div className="select-none flex flex-col gap-2">
            <div className="flex flex-col gap-2 items-start sm:flex-row justify-between sm:gap-2">
              <RangePicker
                onChange={e => {
                  if (e && e[0] && e[1]) {
                    setPeriod([e[0], e[1]]);
                  }
                }}
                size="large"
                picker="month"
                format="YYYY-MM"
                disabledDate={disabled12MonthsDate}
                className="w-fit"
              />
              <div className="flex items-center gap-3 select-none">
                <p className="text-2xl text-primary font-semibold">
                  {totalSales?.toLocaleString()}원
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
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <Table
                columns={columns}
                dataSource={salesData ?? []}
                onChange={handleChange}
                showSorterTooltip={{
                  target: "sorter-icon",
                }}
              />
            </div>
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
};
export default BusinessIndex;
