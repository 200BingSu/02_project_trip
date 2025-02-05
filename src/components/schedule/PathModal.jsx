import { useState } from "react";

const PathModal = () => {
  //useState
  const [title, setTitle] = useState("");
  // 모달창
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
                flex items-end justify-center
                bg-[rgba(0,0,0,0.5)]"
      onClick={() => {
        handleBackgroundClick();
      }}
    >
      {/* 모달창 */}
      <div
        className="bg-white w-full 
                    rounded-t-2xl px-[60px] py-[55px]"
        onClick={handleModalClick}
      >
        <h2>빠른 길 찾기</h2>
        <ul>
          <li>출발지</li>
          <li>도착지</li>
        </ul>
        {/* 교통 수단 */}
        <ul>
          <li className="flex">
            {/* 좌 */}
            <div>
              <div>
                <p>시간</p>
                <p>금액</p>
              </div>
              <p>거리</p>
            </div>
            {/* 우 */}
            <div>아이콘</div>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default PathModal;
