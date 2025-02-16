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
import { memo, useEffect, useRef, useState } from "react";
import { userAtom } from "../../atoms/userAtom";
import { getCookie } from "../../utils/cookie";
import { Dropdown, Input } from "antd";
import { MdContentCopy } from "react-icons/md";
import dayjs from "dayjs";
import Loading from "../../components/loading/Loading";
import UserIndex from "../user/UserIndex";

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
  const navigateCalculation = () => {
    navigate(`/schedule/calculation?tripId=${tripId}`);
  };
  const navigatePostBoard = () => {
    navigate(`/scheduleboard/schedulePost?tripId=${tripId}`);
  };
  // useState
  const [tripData, setTripData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(tripData.title);
  const [addLink, setAddLink] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  // const [isOpen, setIsOpen] = useState(false);

  const [isModalOpen, SetIsModalOpen] = useState(false);

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
  const getAddLink = useCallback(async () => {
    try {
      const res = await jwtAxios.get(`/api/trip/add-link?trip_id=${tripId}`);
      console.log(res.data);
      setAddLink(res.data.data);
    } catch (error) {
      console.log("초대코드", error);
    }
  }, []);
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(addLink);
      console.log("복사 성공");
    } catch (err) {
      console.error("복사 실패:", err);
    }
  }, []);
  // 드롭다운 메뉴
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

  // api 여행 확인하기
  const getTrip = useCallback(async () => {
    try {
      const res = await jwtAxios.get(`/api/trip?trip_id=${tripId}&signed=true`);
      console.log("여행확인하기", res.data);
      const resultData = res.data.data;
      setTripData(resultData);
      if (resultData) {
        setIsLoading(true);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  // 여행 수정 함수
  const handleClickCancle = () => {
    setIsEdit(false);
  };
  const handleClickEdit = () => {
    getTrip();
  };
  // useEffect
  useEffect(() => {
    getTrip();
    if (tripData) {
      setTitle(tripData.title);
    }
  }, []);

  const tripDaysArr = tripData.days;

  return (
    <div>
      {isLoading ? (
        <>
          {/* <UserIndex isOpen={isOpen} onClose={() => setIsOpen(false)} /> */}
          <TitleHeader
            icon="back"
            onClick={navigateBack}
            rightContent={
              <RightContent
                icon1={false}
                icon2={true}
                icon3Click={navigatePostBoard}
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
                <button type="button" onClick={() => setIsEdit(true)}>
                  <IoSettingsOutline className="text-[24px] text-slate-300 bg-white" />
                </button>
              </div>
              <h2 className="text-[36px] text-slate-700 font-bold">
                {tripData.title}
              </h2>
              {/* 임시 위치, 참여 인원 정보 */}
              <div className="flex items-center gap-3 mt-5">
                {/* {item.paidUserList.slice(0, 3).map((member, index) => (
                    <span
                      key={member.user_id}
                      className="inline-block w-14 h-14 !border-4 border-white rounded-full overflow-hidden -ml-9 first:ml-0 "
                      style={{ zIndex: 9 - index }} // zIndex 값 동적 적용
                    >
                      <img
                        src={`${ProfilePic}${member?.user_id}/${member?.profile_pic}`}
                        alt={member.name}
                      />
                      {index !== item.paidUserList.length - 1 && ", "}
                    </span>
                  ))}
                  <span className="text-lg text-slate-500 font-semibold">
                    {item.paidUserList.length === 1
                      ? `${item.paidUserList[0]?.name}`
                      : `${item.paidUserList[0]?.name} 외 ${item.paidUserList.length - 1}명`}
                  </span> */}
              </div>
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
                <button
                  type="button"
                  className="flex items-center gap-[10px] 
                  px-[15px] py-[10px] rounded-3xl
                  text-white bg-primary"
                  onClick={getAddLink}
                >
                  <AiOutlinePlus />
                  초대 코드
                </button>
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
                onClick={navigateCalculation}
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
        </>
      ) : (
        <Loading />
      )}
      {/* 여행 수정 모달 */}
      {isEdit && (
        <EditTripModal
          tripData={tripData}
          handleClickCancle={handleClickCancle}
          getTrip={getTrip}
        />
      )}
    </div>
  );
};
export default memo(ScheduleIndex);
