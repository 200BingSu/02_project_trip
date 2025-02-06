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
    <div
      className="flex items-end justify-end 
                    max-w-3xl w-full h-full mx-auto  
                    bg-[rgba(0,0,0,0.5)] 
                    fixed bottom-0 left-[50%] translate-x-[-50%] z-50"
      onClick={handleBackgroundClick}
    >
      {/* 모달창 */}
      <div
        className="
          flex flex-col gap-[30px]
          px-[20px] py-[30px] w-full
          rounded-t-3xl
        bg-white"
        onClick={handleModalClick}
      >
        <h2 className="text-[24px] text-slate-700 font-semibold">쿠폰 선택</h2>
        <ul className="max-h-[411px] overflow-y-scroll">
          {couponList.map((item, index) => {
            return (
              <li
                className="flex flex-col gap-[20px]
                          px-[20px] py-[20px] "
                key={index}
                onClick={() => handleClickList(item)}
              >
                <p className="text-[28px] text-primary font-bold">
                  {item.discountPer}%
                </p>
                <div className="flex flex-col gap-[5px]">
                  <h4 className="text-[20px] text-slate-700 font-semibold">
                    {item.title}
                  </h4>
                  <p className="text-[18px] text-slate-400">
                    {`${dayjs(item.expiredAt).format("YYYY-MM-DD")} 사용 가능`}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SelectCoupon;
