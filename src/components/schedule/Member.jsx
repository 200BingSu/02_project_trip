import React from "react";
import { ProfilePic } from "../../constants/pic";
import { IoCloseSharp } from "react-icons/io5";

const Member = ({ tripData, handleClickCancle }) => {
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
            bg-[rgba(0,0,0,0.5)]"
      onClick={handleBackgroundClick}
    >
      {/* 모달 */}
      <div onClick={handleModalClick} className="bg-white p-6 w-2/3 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-700 text-xl font-semibold py-2">
            여행 참여자
          </h3>
          <button
            className="text-slate-700 text-2xl font-pretendard"
            onClick={handleClickCancle}
          >
            <IoCloseSharp />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <ul className="flex items-center gap-2">
            {tripData?.tripUserIdList?.map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-3 text-slate-700 text-base font-pretendard"
              >
                <div className="w-8 aspect-square rounded-full overflow-hidden bg-slate-100">
                  {/* <img
                    src={`${ProfilePic}/${item.userId}/${item.ProfilePic}`}
                    alt=""
                  /> */}
                  <img src="" alt="" />
                </div>
                <p className="text-slate-700 text-base">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Member;
