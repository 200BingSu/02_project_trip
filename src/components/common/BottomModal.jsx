import { Button } from "antd";
import React, { memo } from "react";

/**
 * ## 하단 모달
 * ### handleClickCancle
 * 취소 버튼 클릭 시 실행되는 함수
 * ### handleClickSubmit
 * 확인 버튼 클릭 시 실행되는 함수
 * ### modalContent
 * 모달 내용
 */
const BottomModal = ({
  handleClickCancle,
  handleClickSubmit,
  modalContent = null,
  showButton = true,
}) => {
  //모달
  const handleBackgroundClick = () => {
    handleClickCancle();
  };

  const handleModalClick = e => {
    e.stopPropagation();
  };
  return (
    <div
      className="fixed top-0 left-[50%] translate-x-[-50%] z-10
                max-w-3xl w-full mx-auto h-screen
                flex items-end justify-center
                bg-[rgba(0,0,0,0.5)]
                "
      onClick={() => {
        handleBackgroundClick();
      }}
    >
      {/* 모달창 */}
      <div
        className="bg-white w-full 
                    rounded-t-2xl px-[60px] py-[55px]
                    flex flex-col gap-[20px]
                    mb-[100px]
                    "
        onClick={handleModalClick}
      >
        {/* 모달 내용 */}
        {modalContent}
        {/* 버튼 목록 */}
        {showButton ? (
          <div className="flex gap-[20px]">
            <Button
              color="default"
              variant="filled"
              htmlType="button"
              className="px-[15px] py-[20px] text-[24px] text-slate-400 font-semibold
            w-full"
              onClick={handleClickCancle}
            >
              취소
            </Button>
            <Button
              type="primary"
              htmlType="button"
              className="px-[15px] py-[20px] text-[24px] text-white font-semibold
            w-full"
              onClick={handleClickSubmit}
            >
              확인
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default memo(BottomModal);
