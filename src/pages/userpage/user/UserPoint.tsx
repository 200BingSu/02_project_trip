import { IoIosArrowDown } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import { useEffect, useState } from "react";
import Point from "../../../components/point/Point";
import jwtAxios from "../../../apis/jwt";
import { IPoint } from "../../../types/interface";
import Footer from "../../Footer";
import SortSelection from "../../../components/basic/SortSelection";
import dayjs from "dayjs";

const UserPoint = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [point, setPoint] = useState<IPoint>();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>(dayjs().format("YYYY-MM-DD"));

  const handleClose = () => {
    if (isOpen === true) {
      setIsOpen(false);
    }
  };

  const pointHis = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await jwtAxios.get(
        `/api/point/history?start_at=${startDate}&end_at=${endDate}&is_desc=true`,
      );
      setPoint(res.data.data);
      console.log("✅  pointHis  res:", res.data.data);
    } catch (error) {
      console.log("✅  pointHis  error:", error);
    }
  };

  // 🔹 버튼 클릭 시 날짜 변경 함수
  const handleDateChange = (months: number | null) => {
    if (months) {
      setStartDate(dayjs().subtract(months, "month").format("YYYY-MM-DD"));
    } else {
      // 직접 입력 버튼 클릭 시 처리 (현재는 기본값 유지)
      console.log("직접 입력 기능 구현 필요");
    }
  };

  // 🔹 날짜가 변경될 때 자동 호출
  useEffect(() => {
    if (startDate) {
      pointHis();
    }
  }, [startDate, endDate]);

  return (
    <div>
      <TitleHeaderTs icon="back" title="포인트" onClick={() => navigate(-1)} />
      <div>
        <div className="mx-4 my-6">
          <div>
            <h3 className="text-base text-slate-500 mb-[6px]">
              {point?.userName}님의
              <span className="text-primary">보유 포인트</span>
            </h3>
            <h1 className="text-4xl font-bold text-slate-700">
              {point?.remainPoint.toLocaleString()}
              <span className="font-light text-slate-500 ml-3">P</span>
            </h1>
          </div>
          <div className="flex py-6 border-[1px] border-slate-200 rounded-lg mt-4">
            <div
              className="flex flex-col flex-1 items-center gap-[6px] border-r-[1px] border-slate-100 cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              <img
                src="/images/icon/IoQrCode.svg"
                alt="IoQrCode"
                className="w-6 aspect-square"
              />
              <p className="text-sm text-slate-700">QR/스마트 결제</p>
            </div>
            <Link
              to="payment"
              className="flex flex-col flex-1 items-center gap-[6px] cursor-pointer"
            >
              <img
                src="/images/icon/AiOutlinePlusCircle.svg"
                alt="AiOutlinePlusCircle"
                className="w-6 aspect-square"
              />
              <p className="text-sm text-slate-700">포인트 충전</p>
            </Link>
          </div>
        </div>
        <ul className="px-4">
          <li className="flex justify-between py-4 ">
            <p className="text-base text-slate-700 font-semibold">
              적립/사용내역
            </p>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-[6px] text-sm text-slate-500"
            >
              전체
              <IoIosArrowDown className="text-slate-400 text-sm" />
            </button>
          </li>
          {point?.pointList.map(item => {
            return (
              <li
                className="flex justify-between py-4"
                key={item.pointHistoryId}
              >
                <div>
                  <p className="text-slate-700 text-base mb-[2px]">
                    {item.usedAt}
                  </p>
                  <p className="text-slate-400 text-sm tracking-tight">
                    {item.addedAt}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-lg font-semibold mb-[2px] ${
                      item.category === 1 ? "text-primary" : "text-slate-700"
                    }`}
                  >
                    {item.amount.toLocaleString()}P
                  </p>
                  <p className="text-slate-400 text-sm text-right">
                    {item.remainPoint.toLocaleString()}P
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      {isOpen && <Point handleClose={handleClose} />}
      <SortSelection
        open={isSortOpen}
        onClose={() => setIsSortOpen(!isSortOpen)}
        date={handleDateChange}
      />
      <Footer />
    </div>
  );
};

export default UserPoint;
