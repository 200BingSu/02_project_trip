import React from "react";

const EditModal = () => {
  // 모달
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
            flex items-center justify-center
            bg-[rgba(0,0,0,0.5)]
            "
      onClick={() => {
        handleBackgroundClick();
      }}
    >
      {/* 모달 */}
      <div onClick={handleModalClick}>
        <h3 className="text-slate-700 text-xl">여행 수정</h3>
      </div>
    </div>
  );
};

export default EditModal;
