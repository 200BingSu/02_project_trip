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
import { useEffect, useRef, useState } from "react";
import { userAtom } from "../../atoms/userAtom";
import { getCookie } from "../../utils/cookie";
import { Dropdown, Input } from "antd";
import { MdContentCopy } from "react-icons/md";
import dayjs from "dayjs";

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
  const tripId = parseInt(searchParams.get("tripId"));
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
  const [title, setTitle] = useState(tripData.title);
  const [addLink, setAddLink] = useState("");
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    console.log("여행 데이터", tripData);
  }, [tripData]);
  useEffect(() => {
    console.log("링크", addLink);
  }, [addLink]);
  useEffect(() => {
    console.log("title", title);
  }, [title]);
  // 여행 수정
  const onChange = e => {
    setTitle(e.target.value);
  };

  // URL
  const getAddLink = async () => {
    try {
      const res = await axios.get(`/api/trip/add-link?trip_id=${tripId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(res.data);
      setAddLink(res.data.data);
    } catch (error) {
      console.log("초대코드", error);
    }
  };
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(addLink);
      console.log("복사 성공");
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };
  const items = [
    {
      label: (
        <div
          onClick={() => handleCopy()}
          className="flex flex-col gap-[10px] items-center justify-center"
        >
          <p className="bg-slate-100 px-[15px] py-[10px] rounded-lg text-slate-600">
            {addLink}
          </p>
          <p className="flex items-center gap-1 border-b border-slate-300">
            <i className="text-slate-500">
              <MdContentCopy />
            </i>
            <span className="text-slate-500">초대코드 복사하기</span>
          </p>
        </div>
      ),
      key: "0",
    },
  ];

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
    if (tripData) {
      setTitle(tripData.title);
    }
  }, []);

  const tripDaysArr = tripData.days;
  // 날짜 계산
  const getDateArray = (startDate, endDate) => {
    if (!startDate || !endDate) {
      console.log("🚨 startDate 또는 endDate가 없습니다.");
      return [];
    }

    const start = dayjs(startDate, "YYYY-MM-DD");
    const end = dayjs(endDate, "YYYY-MM-DD");

    console.log("start:", start.format("YYYY-MM-DD"));
    console.log("end:", end.format("YYYY-MM-DD"));

    const dateArray = [];
    let currentDate = start;

    while (currentDate.isBefore(end, "day") || currentDate.isSame(end, "day")) {
      dateArray.push(currentDate.format("YYYY-MM-DD"));
      currentDate = currentDate.add(1, "day");
    }

    return dateArray;
  };
  const dateArr = getDateArray(tripData.startAt, tripData.endAt);
  console.log("dateArr", dateArr);

  return (
    <div>
      <TitleHeader
        icon="back"
        onClick={navigateBack}
        rightContent={
          <RightContent
            icon1={false}
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
          {edit ? (
            <Input
              placeholder="메모를 입력해주세요."
              variant="borderless"
              allowClear
              onChange={e => {
                onChange(e);
              }}
            />
          ) : (
            <h2 className="text-[36px] text-slate-700 font-bold">
              {tripData.title}
            </h2>
          )}
        </div>
        {/* 버튼 */}
        <div className="flex items-center gap-[10px] px-[32px]">
          <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
            overlayStyle={{ marginTop: "10px" }}
          >
            <a onClick={e => e.preventDefault()}>
              <button
                type="button"
                className="flex items-center gap-[10px] 
            px-[15px] py-[10px] rounded-3xl
            text-white bg-primary"
                onClick={() => getAddLink()}
              >
                <AiOutlinePlus />
                초대 코드
              </button>
            </a>
          </Dropdown>
          {/* <button
            type="button"
            className="flex items-center gap-[10px] 
            px-[15px] py-[10px] rounded-3xl
            text-slate-500 bg-slate-100"
          >
            <AiOutlinePlus className="text-slate-300" />
            숙소
          </button> */}
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
          {tripDaysArr === null ? (
            <ScheduleDay
              newTrip={true}
              data={defaultData}
              startAt={tripData?.startAt}
              tripId={tripId}
              getTrip={getTrip}
              setTripData={setTripData}
            />
          ) : (
            tripDaysArr?.map((item, index) => {
              return (
                <ScheduleDay
                  newTrip={true}
                  data={item}
                  key={index}
                  startAt={tripData?.startAt}
                  tripId={tripId}
                  getTrip={getTrip}
                  setTripData={setTripData}
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
