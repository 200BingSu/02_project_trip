import { useNavigate, useSearchParams } from "react-router-dom";
import TitleHeader, {
  RightContent,
} from "../../components/layout/header/TitleHeader";
import { AiOutlinePlus, AiTwotoneSetting } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import ScheduleDay from "../../components/scheduleboard/ScheduleDay";
import axios from "axios";
import jwtAxios from "../../apis/jwt";
import { useRecoilState, useRecoilValue } from "recoil";
import { tripAtom } from "../../atoms/tripAtom";
import { useEffect, useState } from "react";
import { userAtom } from "../../atoms/userAtom";
import { getCookie } from "../../utils/cookie";

// const dummyDays = dummyData.days;
const defaultData = {
  day: 1,
  weather: "",
  schedules: [],
};
const ScheduleIndex = () => {
  const accessToken = getCookie("accessToken");
  // recoil
  const [trip, setTrip] = useRecoilState(tripAtom);
  useEffect(() => {
    console.log("trip", trip);
  }, [trip]);

  //쿼리스트링
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("tripId");
  useEffect(() => {
    setTrip({ ...trip, nowTripId: tripId });
  }, []);

  // useNavigate
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate(-1);
  };
  const navigatePostBoard = () => {
    navigate(`/scheduleboard/schedulePost`);
  };
  // useState
  const [tripData, setTripData] = useState({});
  useEffect(() => {
    console.log(tripData);
  }, [tripData]);
  // 여행 확인하기
  const getTrip = async () => {
    try {
      const res = await axios.get(`/api/trip?trip_id=${tripId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("여행확인하기", res.data);
      const resultData = res.data.data;
      setTripData(resultData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getTrip();
  }, []);

  const tripDaysArr = tripData.days;
  return (
    <div>
      <TitleHeader
        icon="back"
        onClick={navigateBack}
        rightContent={
          <RightContent
            icon1={true}
            icon2={true}
            icon2Click={navigatePostBoard}
            icon3={true}
            icon4={true}
          />
        }
      />
      {/* 내용 */}
      <div className="flex flex-col gap-[30px] py-[30px]">
        {/* 제목 */}
        <div className="mt-[60px] flex flex-col gap-[10px] px-[32px]">
          <div className="flex items-center justify-between">
            <p className="text-[18px] text-slate-700 ">
              <span>{tripData.startAt}</span>-<span>{tripData.endAt}</span>
            </p>
            <button type="button">
              <IoSettingsOutline className="text-[24px] text-slate-300 bg-white" />
            </button>
          </div>
          <h2 className="text-[36px] text-slate-700 font-bold">
            {tripData.title}
          </h2>
        </div>
        {/* 버튼 */}
        <div className="flex items-center gap-[10px] px-[32px]">
          <button
            type="button"
            className="flex items-center gap-[10px] 
            px-[15px] py-[10px] rounded-3xl
            text-white bg-primary"
          >
            <AiOutlinePlus /> 일행 추가하기
          </button>
          <button
            type="button"
            className="flex items-center gap-[10px] 
            px-[15px] py-[10px] rounded-3xl
            text-slate-500 bg-slate-100"
          >
            <AiOutlinePlus className="text-slate-300" />
            숙소
          </button>
          <button
            type="button"
            className="flex items-center gap-[10px] 
            px-[15px] py-[10px] rounded-3xl
            text-slate-500 bg-slate-100"
          >
            <AiOutlinePlus className="text-slate-300" />
            가계부
          </button>
        </div>
        {/* 맵, 일정 */}
        <div className="flex flex-col gap-[50px]">
          {tripDaysArr?.length === 0 ? (
            <ScheduleDay
              newTrip={true}
              data={defaultData}
              startAt={tripData?.startAt}
              tripId={nowTripId}
            />
          ) : (
            tripDaysArr?.map((item, index) => {
              return (
                <ScheduleDay
                  newTrip={true}
                  data={item}
                  key={index}
                  startAt={tripData?.startAt}
                  tripId={trip.nowTripId}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
export default ScheduleIndex;
