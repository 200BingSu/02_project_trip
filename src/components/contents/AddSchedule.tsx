import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IAddSchedule } from "../../types/interface";
import jwtAxios from "../../apis/jwt";
import { LocationPic } from "../../constants/pic";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const AddSchedule = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [addTrip, setAddTrip] = useState<IAddSchedule[]>([]);
  const navigate = useNavigate();

  const getAddTrip = async () => {
    try {
      const res = await jwtAxios.get(`/api/trip-list`);
      setAddTrip(res.data.data.beforeTripList);
    } catch (error) {
      console.log("여행 목록 불러오기:", error);
    }
  };

  useEffect(() => {
    getAddTrip();
  }, []);

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
          <div
            onClick={() => navigate("/search/location")}
            className="w-auto h-auto p-5 bg-slate-50 rounded-lg flex items-center gap-5 mx-3 cursor-pointer mb-4"
          >
            <i className="inline-block p-[10px] bg-primary rounded-full">
              <AiOutlinePlus className="text-white" />
            </i>
            <div>
              <p className="text-lg text-slate-700 font-semibold">
                여행 일정 만들기
              </p>
            </div>
          </div>

          <div className="px-3">
            {addTrip.map(item => (
              <div className="flex items-center gap-3 w-full bg-slate-50 p-5 rounded-lg mb-3 cursor-pointer">
                {/* 이미지 */}
                <div className="w-8 h-8 bg-slate-100 rounded-full overflow-hidden">
                  <img
                    src={`${LocationPic}/${item.locationPic}`}
                    alt={item.title}
                    className="w-full h-full"
                  />
                </div>
                {/* 정보 */}
                <div className="flex flex-col">
                  <h3 className="text-base text-slate-700 font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 tracking-tight">
                    {item.startAt.replace(/-/g, ".")} -{" "}
                    {item.endAt.replace(/-/g, ".")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AddSchedule;
