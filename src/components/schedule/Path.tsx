import { useRecoilState } from "recoil";
import { tripAtom } from "../../atoms/tripAtom";
import { useState } from "react";
import { motion } from "framer-motion";

interface PathProps {
  open: boolean;
  onClose: () => void;
}

const Path = ({ open, onClose }: PathProps) => {
  const [trip, setTrip] = useRecoilState(tripAtom);
  const [selectedPath, setSelectedPath] = useState(null);
  return (
    <motion.div
      tabIndex={-1}
      className="max-w-[768px] w-full left-1/2 -translate-x-1/2 fixed inset-0 bg-black/50 flex justify-center items-end z-[9999] overflow-hidden"
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
        <div></div>
      </motion.div>
    </motion.div>
  );
};

export default Path;
