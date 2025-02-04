import { Input } from "antd";

const MemoModal = ({ setMemoModal }) => {
  const handleBackgroundClick = () => {
    setMemoModal(false);
  };
  const handleModalClick = e => {
    e.stopPropagation();
  };
  //   검색창
  const onChange = e => {};

  return (
    <div
      className="fixed top-0 left-[50%] translate-x-[-50%] z-10
                max-w-3xl w-full mx-auto h-full
                flex items-center justify-center
                bg-[rgba(0,0,0,0.5)]"
      onClick={() => {
        handleBackgroundClick();
      }}
    >
      {/* 모달창 */}
      <div
        className="bg-white w-[630px] 
                    rounded-2xl px-[60px] py-[55px]"
        onClick={handleModalClick}
      >
        <Input
          placeholder="메모 제목"
          variant="borderless"
          allowClear
          onChange={e => {
            handleModalClick();
            onChange();
          }}
        />
      </div>
    </div>
  );
};
export default MemoModal;
