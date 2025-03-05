import { Button } from "antd";
import React, { useEffect, useState } from "react";
import jwtAxios from "../../apis/jwt";
import { LocationPic } from "../../constants/pic";
import { useNavigate, useSearchParams } from "react-router-dom";
const SelectTrip = ({
  openSelectTripModal,
  setOpenSelectTripModal,
  tripLocationList,
  tripReviewId,
}) => {
  //useNavigate
  const navigate = useNavigate();
  const navigateSelectDay = () => {
    navigate(`/schedule/days`, {
      state: {
        selectedLocationId: tripLocationList,
        tripReviewId: tripReviewId,
        tripId: selectedTripData.tripId,
        title: selectedTripData.title,
        from: "/scheduleboard/scheduleDetail",
      },
    });
  };

  //useState
  const [tripListData, setTripListData] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedTripData, setSelectedTripData] = useState(null);

  useEffect(() => {
    console.log("tripListData", tripListData);
  }, [tripListData]);
  useEffect(() => {
    console.log("selectedTripData", selectedTripData);
  }, [selectedTripData]);

  // 여행 목록 불러오기
  const getTripList = async () => {
    try {
      const res = await jwtAxios.get(`/api/trip-list`);
      console.log(res.data);
      const resultData = res.data;
      const beforeArr = resultData.data.beforeTripList;
      setTripListData(beforeArr);
    } catch (error) {
      console.log("여행 목록 불러오기:", error);
    }
  };
  const handleSelectTrip = (item, index) => {
    setSelectedTrip(index);
    console.log("item", item);
    setSelectedTripData(item);
  };
  // 모달창

  const handleBackgroundClick = () => {
    setOpenSelectTripModal(false);
  };

  const handleModalClick = e => {
    e.stopPropagation();
  };
  useEffect(() => {
    getTripList();
  }, []);
  return (
    <div
      className="fixed top-0 left-[50%] translate-x-[-50%] z-10

            max-w-3xl w-full mx-auto h-screen
            flex items-end justify-center
            bg-[rgba(0,0,0,0.5)]
            pb-[70px]
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
                "
        onClick={handleModalClick}
      >
        <h2 className="text-[28px] text-slate-700 font-bold">
          이 일정을 담을 여행을 선택해주세요.
        </h2>
        {/* <Button
          type="primary"
          className="w-[200px] h-[40px] rounded-[16px] py-[10px]
          text-[16px] text-white font-medium"
        >
          새 여행을 만들어 담기
        </Button> */}

        {/* 여행 일정 선택*/}
        <div className="flex flex-col gap-[5px]">
          <h3 className="text-[18px] text-slate-700 font-semibold">
            나의 다가오는 여행
          </h3>
          <ul
            className="flex flex-col px-[10px] py-[20px] gap-[30px]
          max-h-[55vh] overflow-y-auto"
          >
            {tripListData?.map((item, index) => {
              return (
                <li
                  key={index}
                  className={`flex items-center gap-[20px] px-[20px] py-[10px] rounded-[16px] ${
                    selectedTrip === index ? "bg-slate-200" : ""
                  }`}
                  onClick={() => handleSelectTrip(item, index)}
                >
                  {/* 사진 */}

                  <div className="w-[50px] h-[50px] bg-slate-100 rounded-full overflow-hidden">
                    <img
                      src={`${LocationPic}/${item.locationPic}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* 일정 정보 */}
                  <div className="flex flex-col gap-[5px]">
                    <h4 className="text-[18px] text-slate-700 font-semibold">
                      {item.title}
                    </h4>
                    <p className="text-[16px] text-slate-500">
                      <span>{item.startAt}</span>
                      <span>-</span>
                      <span>{item.endAt}</span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 완료 */}
        <Button
          type="primary"
          htmlType="button"
          className="h-[50px] px-[15px] py-[20px] text-[24px] text-white font-semibold"
          onClick={navigateSelectDay}
        >
          선택 완료
        </Button>
      </div>
    </div>
  );
};

export default SelectTrip;
