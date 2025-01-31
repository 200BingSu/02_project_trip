const SelectCoupon = ({ setShowCouponModal }) => {
  const handleBackgroundClick = () => {
    setShowCouponModal(false);
  };

  const handleModalClick = e => {
    e.stopPropagation();
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
      >
        <h2 className="text-[24px] text-slate-700 font-semibold">쿠폰 선택</h2>
        <ul>
          <li
            className="flex flex-col gap-[20px]
                          px-[20px] py-[20px]"
          >
            <p className="text-[28px] text-primary font-bold">금액</p>
            <div className="flex flex-col gap-[5px]">
              <h4 className="text-[20px] text-slate-700 font-semibold">
                [웰컴 기프트] 숙소 할인 {(12000).toLocaleString()}원
              </h4>
              <p className="text-[18px] text-slate-400">유효기간</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SelectCoupon;
