import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button, DatePicker } from "antd";
import "../../styles/antd-styles.css";

const { RangePicker } = DatePicker;

type SortSelectionProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (
    startDate: string,
    endDate: string,
    isDesc: boolean,
    period: string,
  ) => void;
};

const SortSelection = ({ open, onClose, onSelect }: SortSelectionProps) => {
  const [selectedMonth, setSelectedMonth] = useState<number | "direct">(1);
  const [selectedSort, setSelectedSort] = useState<"latest" | "oldest">(
    "latest",
  );
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(1, "month"),
    dayjs(),
  ]);

  const dateFormat = "YYYY/MM/DD";

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  const handleSelect = (months: number | "direct") => {
    setSelectedMonth(months);
  };

  const handleSearch = () => {
    let startDate: string;
    let endDate: string;
    let periodText: string;

    if (selectedMonth === "direct") {
      startDate = dateRange[0].format("YYYY-MM-DD");
      endDate = dateRange[1].format("YYYY-MM-DD");
      periodText = "직접입력";
    } else {
      startDate = dayjs().subtract(selectedMonth, "month").format("YYYY-MM-DD");
      endDate = dayjs().format("YYYY-MM-DD");
      periodText = `${selectedMonth}개월`;
    }

    const isDesc = selectedSort === "latest";
    onSelect(startDate, endDate, isDesc, periodText);
    onClose();
  };

  return (
    <div>
      <motion.div
        tabIndex={-1}
        className="max-w-[768px] w-full left-1/2 -translate-x-1/2 fixed inset-0 bg-black/50 flex justify-center items-end z-50 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => onClose()} // ✅ 배경 클릭 시 onClose 실행
      >
        <motion.div
          className=" bg-white w-full rounded-t-3xl py-5 shadow-lg"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 100 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.y > 100) onClose();
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Bottom Sheet Header */}
          <div className="w-12 h-1 bg-slate-400 rounded-full mx-auto mb-4"></div>
          {/* Bottom Sheet Main */}
          <div>
            <p className="text-xl font-semibold text-slate-700 px-4 py-4">
              조회기간
            </p>
            <div className="w-full flex justify-center px-4">
              {[1, 3, 6, 12].map(months => (
                <button
                  key={months}
                  onClick={() => handleSelect(months)}
                  className={`w-1/5 py-3 text-slate-400 border border-slate-200 border-l-0 first:border-l las text-sm 
                    ${selectedMonth === months ? "bg-white !border-slate-400 !border text-slate-700" : "bg-slate-50"}`}
                >
                  {months}개월
                </button>
              ))}

              <button
                onClick={() => handleSelect("direct")}
                className={`w-1/5 py-3 text-slate-400 border border-slate-200 border-l-0 text-sm 
                  ${selectedMonth === "direct" ? "bg-white !border-slate-400 !border text-slate-700" : "bg-slate-50"}`}
              >
                직접입력
              </button>
            </div>
            {/* 직접입력이 선택되었을 때만 RangePicker 표시 */}
            {selectedMonth === "direct" && (
              <div className="px-4 mt-4">
                <RangePicker
                  value={dateRange}
                  onChange={dates => {
                    if (dates) {
                      setDateRange([dates[0]!, dates[1]!]);
                    }
                  }}
                  format={dateFormat}
                  className="custom-date-picker w-full py-3 rounded-none"
                />
              </div>
            )}
          </div>
          <div>
            <p className="text-xl font-semibold text-slate-700 px-4 py-4">
              정렬선택
            </p>
            <div className="flex justify-center px-4">
              <button
                onClick={() => setSelectedSort("latest")}
                className={`w-1/2 py-3 text-slate-400 border border-slate-200 border-l-0 first:border-l text-sm
                  ${selectedSort === "latest" ? "bg-white !border-slate-400 !border text-slate-700" : "bg-slate-50"}`}
              >
                최신순
              </button>
              <button
                onClick={() => setSelectedSort("oldest")}
                className={`w-1/2 py-3 text-slate-400 border border-slate-200 border-l-0 text-sm
                  ${selectedSort === "oldest" ? "bg-white !border-slate-400 !border text-slate-700" : "bg-slate-50"}`}
              >
                과거순
              </button>
            </div>
          </div>
          <div className="px-4 mt-6">
            <Button
              type="primary"
              className="text-base h-auto py-3 w-full"
              onClick={handleSearch}
            >
              조회하기
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SortSelection;
