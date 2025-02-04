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

// dummy
// const dummyData = {
//   totalDistance: 0,
//   totalDuration: 0,
//   scheduleCnt: 12,
//   memoCnt: 3,
//   days: [
//     {
//       day: 1,
//       weather: "맑음",
//       schedules: [
//         {
//           scheduleId: 22,
//           scheOrMemo: "SCHE",
//           seq: 1,
//           distance: 2.5,
//           duration: 15,
//           strfId: 499,
//           strfTitle: "경북대학교 캠퍼스",
//           category: "TOUR",
//           address: "대구광역시 북구 산격동 1370-1",
//           lat: "35.8907065",
//           lng: "128.6100194",
//           pathType: "WALK",
//           tripId: 1,
//           title: null,
//           content: null,
//         },
//         {
//           scheduleId: 25,
//           scheOrMemo: "MEMO",
//           seq: 4,
//           distance: null,
//           duration: null,
//           strfId: null,
//           strfTitle: null,
//           category: null,
//           address: null,
//           lat: null,
//           lng: null,
//           pathType: null,
//           tripId: 1,
//           title: "여행 첫날 메모",
//           content: "첫째 날 여행 계획 정리",
//         },
//       ],
//     },
//     {
//       day: 2,
//       weather: "흐림",
//       schedules: [
//         {
//           scheduleId: 30,
//           scheOrMemo: "SCHE",
//           seq: 1,
//           distance: 1.8,
//           duration: 10,
//           strfId: 500,
//           strfTitle: "동성로 거리",
//           category: "SHOPPING",
//           address: "대구광역시 중구 동성로",
//           lat: "35.8686",
//           lng: "128.5975",
//           pathType: "BUS",
//           tripId: 1,
//           title: null,
//           content: null,
//         },
//         {
//           scheduleId: 31,
//           scheOrMemo: "SCHE",
//           seq: 2,
//           distance: 3.2,
//           duration: 20,
//           strfId: 501,
//           strfTitle: "서문시장",
//           category: "FOOD",
//           address: "대구광역시 중구 큰장로26길",
//           lat: "35.8700",
//           lng: "128.5828",
//           pathType: "SUBWAY",
//           tripId: 1,
//           title: null,
//           content: null,
//         },
//       ],
//     },
//     {
//       day: 3,
//       weather: "비",
//       schedules: [
//         {
//           scheduleId: 35,
//           scheOrMemo: "SCHE",
//           seq: 1,
//           distance: 5.0,
//           duration: 30,
//           strfId: 502,
//           strfTitle: "앞산공원",
//           category: "NATURE",
//           address: "대구광역시 남구 앞산순환로",
//           lat: "35.8312",
//           lng: "128.5938",
//           pathType: "CAR",
//           tripId: 1,
//           title: null,
//           content: null,
//         },
//         {
//           scheduleId: 36,
//           scheOrMemo: "MEMO",
//           seq: 3,
//           distance: null,
//           duration: null,
//           strfId: null,
//           strfTitle: null,
//           category: null,
//           address: null,
//           lat: null,
//           lng: null,
//           pathType: null,
//           tripId: 1,
//           title: "비 오는 날 여행",
//           content: "우산 챙기기, 실내 관광지 찾기",
//         },
//       ],
//     },
//   ],
// };

// const dummyDays = dummyData.days;
const defaultData = {
  day: 1,
  weather: "",
  schedules: [],
};
const ScheduleIndex = () => {
  const accessToken = getCookie("accessToken");
  // recoil
  // const { accessToken } = useRecoilValue(userAtom);
  const [nowTripId, setNowTripId] = useRecoilState(tripAtom);
  useEffect(() => {
    console.log("nowTripId", nowTripId);
  }, [nowTripId]);
  //쿼리스트링
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("tripId");
  useEffect(() => {
    setNowTripId(tripId);
    console.log("tripId", nowTripId);
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
    // console.log(tripData);
  }, [tripData]);
  // 여행 확인하기
  const getTrip = async () => {
    const sendData = { trip_id: tripId };
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
                  tripId={nowTripId}
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
