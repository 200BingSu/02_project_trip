import { useEffect, useState } from "react";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { useNavigate } from "react-router-dom";
const categoryArr = ["예약 목록", "예약 완료 내역"];
const UserBooking = () => {
  // useNavigate
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate(-1);
  };
  //useState
  const [category, setCategory] = useState(0);
  const [bookingData, setBookingData] = useState({});
  useEffect(() => {
    console.log("카테고리", category);
  }, [category]);
  return (
    <div className="flex flex-col gap-[30px]">
      <TitleHeader icon="back" title="여행" onClick={navigateBack} />

      {/* 여행 리스트 카테고리 */}
      <div className="px-[32px]">
        <ul className="flex items-center">
          {categoryArr.map((item, index) => {
            return (
              <li
                className={`cursor-pointer w-full flex justify-center items-center
                            pt-[17px] pb-[16px]
                            ${category === index ? `text-primary border-b-[2px] border-primary` : `text-slate-400 border-b border-slate-200`}`}
                key={index}
                onClick={() => {
                  setCategory(index);
                }}
              >
                {item}
              </li>
            );
          })}
        </ul>
      </div>
      {/* 여행 목록 */}
      <div className="px-[28px] mb-[40px]">
        {/* 다가오는 여행 */}
        {category === 0 && (
          <ul className="flex flex-col gap-[40px]">
            {tripListData.beforeTripList?.map((item, index) => {
              return (
                <li className="flex items-center justify-between" key={index}>
                  {/* 좌측 */}
                  <div className="flex items-center gap-[29px]">
                    {/* 이미지 */}
                    <div className="w-[100px] h-[100px] bg-slate-100 rounded-full">
                      <img src="" alt="" />
                    </div>
                    {/* 정보 */}
                    <div className="flex flex-col gap-[5px]">
                      <h3 className="text-[24px] text-slate-700 font-semibold">
                        {item.title}
                      </h3>
                      <p className="text-[18px] text-slate-500">
                        <span>{item.startAt}</span>~<span>{item.endAt}</span>
                      </p>
                    </div>
                  </div>
                  {/* 우측 */}
                  <button
                    className="w-[36px] h-[36px] bg-slate-100 px-[10px] py-[10px] rounded-full"
                    onClick={() => {
                      navigateGoTrip(item);
                    }}
                  >
                    <AiOutlinePlus className="text-slate-400" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {/* 완료된 여행 */}
        {category === 1 && (
          <ul className="flex flex-col gap-[40px]">
            {tripListData.afterTripList?.map((item, index) => {
              return (
                <li className="flex items-center justify-between" key={index}>
                  {/* 좌측 */}
                  <div className="flex items-center gap-[29px]">
                    {/* 이미지 */}
                    <div className="w-[100px] h-[100px] bg-slate-100 rounded-full">
                      <img src="" alt="" />
                    </div>
                    {/* 정보 */}
                    <div className="flex flex-col gap-[5px]">
                      <h3 className="text-[24px] text-slate-700 font-semibold">
                        {item.title}
                      </h3>
                      <p className="text-[18px] text-slate-500">
                        <span>{item.startAt}</span>~<span>{item.endAt}</span>
                      </p>
                    </div>
                  </div>
                  {/* 우측 */}
                  <button
                    className="w-[36px] h-[36px] bg-slate-100 px-[10px] py-[10px] rounded-full"
                    onClick={() => {
                      navigateGoTrip(item);
                    }}
                  >
                    <AiOutlinePlus className="text-slate-400" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
export default UserBooking;
