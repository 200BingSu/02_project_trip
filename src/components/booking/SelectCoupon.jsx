import { motion } from "framer-motion";
import dayjs from "dayjs";

const SelectCoupon = ({
  setShowCouponModal,
  couponList,
  selectCoupon,
  setSelectCoupon,
}) => {
  const handleBackgroundClick = () => {
    setShowCouponModal(false);
  };

  const handleModalClick = e => {
    e.stopPropagation();
  };
  const handleClickList = item => {
    setSelectCoupon(item);
    setShowCouponModal(false);
  };
  return (
    <motion.div
      tabIndex={-1}
      className="max-w-[768px] w-full left-1/2 -translate-x-1/2 fixed inset-0 bg-black/50 flex justify-center items-end z-[9999] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setShowCouponModal(false)} // ✅ 배경 클릭 시 onClose 실행
    >
      {/* 모달창 */}
      <motion.div
        className=" bg-white w-full rounded-t-3xl py-5 shadow-lg px-4"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 100 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) setShowCouponModal(false);
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-1 bg-slate-400 rounded-full mx-auto mb-4"></div>
        <h2 className="text-xl text-slate-700 font-semibold mb-6">쿠폰 선택</h2>
        <ul className="max-h-[411px] overflow-y-scroll flex flex-col gap-3">
          {couponList.map((item, index) => {
            return (
              <li
                className="flex flex-col gap-1 py-5 px-4 border border-slate-200 rounded-lg"
                key={index}
                onClick={() => handleClickList(item)}
              >
                <p className="text-xl text-primary font-semibold">
                  {item.discountPer}%
                </p>

                <h4 className="text-lg text-slate-700 font-semibold">
                  {item.title}
                </h4>
                <p className="text-sm text-slate-400 font-light">
                  {`${dayjs(item.expiredAt).format("YYYY.MM.DD")} 사용 가능`}
                </p>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default SelectCoupon;
