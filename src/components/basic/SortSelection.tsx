import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useEffect } from "react";

type SortSelectionProps = {
  open: boolean;
  onClose: () => void;
  date: (months: number | null) => void;
};

const SortSelection = ({ open, onClose, date }: SortSelectionProps) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"; // ✅ 스크롤 막기
    } else {
      document.body.style.overflow = "auto"; // ✅ 닫히면 스크롤 복구
    }

    return () => {
      document.body.style.overflow = "auto"; // ✅ 언마운트 시 스크롤 복구
    };
  }, [open]);

  if (!open) return <></>;

  const today = dayjs();

  const getLastMonth = (month: number) => {
    const today = dayjs();
    const lastMonth = today.subtract(month, "month").format("YYYY-MM-DD");
    return lastMonth;
  };
  console.log(today, getLastMonth(2));
  const dateArr = [
    { label: "1개월", value: date(1) },
    { label: "3개월", value: date(3) },
    { label: "6개월", value: date(6) },
    { label: "1년", value: date(12) },
    { label: "직접입력", value: date(0) },
  ];

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
              {dateArr.map(item => (
                <button
                  onClick={() => {
                    date(Number(item.value));
                  }}
                  className="w-1/5 py-3 bg-slate-50 text-slate-700 border border-slate-200 text-sm"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xl font-semibold text-slate-700 px-4 py-4">
              정렬선택
            </p>
            <div className="flex justify-center px-4">
              <button className="w-1/2 py-3 bg-slate-50 text-slate-700 border border-slate-200 text-sm">
                최신순
              </button>
              <button className="w-1/2 py-3 bg-slate-50 text-slate-700 border border-slate-200 text-sm">
                과거순
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SortSelection;
