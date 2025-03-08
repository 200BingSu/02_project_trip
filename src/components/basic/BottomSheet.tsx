import { motion } from "framer-motion";
import { useEffect } from "react";

type Action = {
  label: string | React.ReactNode;
  onClick: () => void;
};

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  actions?: Action[];
  title?: string;
};

/**
 * ## BottomSheet
 *
 * @param open 바텀 시트 열림 여부
 * @param onClose 바텀 시트 닫기 함수
 * @param actions 바텀 시트 액션 목록
 * @param title 바텀 시트 타이틀
 */
const BottomSheet = ({
  open,
  onClose,
  actions,
  title = "",
}: BottomSheetProps) => {
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

  return (
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
          {title && (
            <p className="text-2xl font-semibold text-slate-700 px-7 py-4">
              {title}
            </p>
          )}
          {actions?.map((action, index) => (
            <button
              key={index}
              className="w-full text-left text-lg text-slate-500 p-4 border-b last:border-none hover:bg-gray-100"
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BottomSheet;
