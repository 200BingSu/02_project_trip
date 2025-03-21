import dayjs from "dayjs";

import { useEffect, useRef, useState } from "react";

import { IoIosArrowDown } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import jwtAxios from "../../../apis/jwt";
import SortSelection from "../../../components/basic/SortSelection";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";

import { IPoint } from "../../../types/interface";
import Footer from "../../Footer";

const UserPoint = (): JSX.Element => {

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [point, setPoint] = useState<IPoint>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();

  const [startDate, setStartDate] = useState(
    dayjs().subtract(1, "month").format("YYYY-MM-DD"),
  );
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [isDesc, setIsDesc] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("1개월");
  const [sortText, setSortText] = useState("최신순");



  const pointHis = async () => {
    try {
      const res = await jwtAxios.get(
        `/api/point/history?start_at=${startDate}&end_at=${endDate}&is_desc=${isDesc}`,
      );
      setPoint(res.data.data);
      console.log("✅  pointHis  res:", res.data.data);
    } catch (error) {
      console.log("✅  pointHis  error:", error);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    pointHis();
  }, []);

  // 날짜나 정렬 순서가 변경될 때마다 데이터 로드
  useEffect(() => {
    if (startDate && endDate) {
      pointHis();
    }
  }, [startDate, endDate, isDesc]);

  const handleDateSelect = (
    start: string,
    end: string,
    desc: boolean,
    period?: string,
  ) => {
    setStartDate(start);
    setEndDate(end);
    setIsDesc(desc);
    if (period) {
      setSelectedPeriod(period);
    }
    setSortText(desc ? "최신순" : "과거순");
  };


  const openCamera = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      alert(`이미지 선택됨: ${file.name}`);
    }
  };


  return (
    <div>
      <TitleHeaderTs
        icon="back"
        title="포인트"
        onClick={() => navigate(`/user/index`)}
      />
      <div>
        <div className="mx-4 my-6">
          <div>
            <h3 className="text-base text-slate-500 mb-[6px]">

              {point?.userName}님의{" "}

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

              onClick={openCamera}

            >
              <img
                src="/images/icon/IoQrCode.svg"
                alt="IoQrCode"
                className="w-6 aspect-square"
              />
              <p className="text-sm text-slate-700">QR/스마트 결제</p>
            </div>

            {/* 숨겨진 input 요소 */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment" // 후면 카메라 (전면은 "user")
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

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
              {selectedPeriod} · {sortText}
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
                      [1, 4].includes(item.category)
                        ? "text-primary"
                        : "text-slate-700"
                    }`}
                  >
                    {[1, 4].includes(item.category)
                      ? `+${item.amount.toLocaleString()}P`
                      : `${item.amount.toLocaleString()}P`}
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



      <SortSelection
        open={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        onSelect={handleDateSelect}
      />
      <Footer />
    </div>
  );
};

export default UserPoint;
