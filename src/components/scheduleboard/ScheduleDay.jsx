import { Rate } from "antd";
import { memo, useEffect, useState } from "react";
import { AiTwotoneHeart } from "react-icons/ai";
import { BiNavigation, BiSolidBus, BiSolidTrain } from "react-icons/bi";
import { BsQuestionLg } from "react-icons/bs";
import { FaWalking } from "react-icons/fa";
import { FaLocationDot, FaTrainSubway } from "react-icons/fa6";
import { IoReaderOutline } from "react-icons/io5";
import { MdOutlineAutoAwesomeMotion } from "react-icons/md";
import {
  CustomOverlayMap,
  Map,
  MapMarker,
  Polyline,
} from "react-kakao-maps-sdk";
import { useNavigate } from "react-router-dom";
import jwtAxios from "../../apis/jwt";
import { MEMO } from "../../constants/api";
import { useRecoilState, useRecoilValue } from "recoil";
import { tripAtom } from "../../atoms/tripAtom";
import MemoModal from "../schedule/MemoModal";
import { getCookie } from "../../utils/cookie";
import axios from "axios";
import { ProductPic } from "../../constants/pic";
import { categoryKor } from "../../utils/match";
import {
  dayBgColor,
  dayLineColor,
  dayTextColor,
  matchPathTypeIcon,
  matchWeatherIcon,
} from "../../utils/match";
import { RiCloseLargeFill } from "react-icons/ri";
import { CgMoreVerticalAlt } from "react-icons/cg";
import CenterModal from "../common/CenterModal";
import BottomModal from "../common/BottomModal";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// defaultData(days[0])

/**
 * ### 인수
 * #### data
 * 하루 단위
 * 디폴트 데이터가 적용되어 있음
 * #### showMap
 * 맵이 보일지 여부(boolean)
 * - 디폴트: true
 *#### newTrip
 *일정 추가 및 메모 추가 버튼 보일지 여부
 */
const ScheduleDay = ({
  data,
  showMap = true,
  newTrip = false,
  startAt,
  tripId,
  getTrip,
  setTripData,
  index,
  date,
  readOnly = false,
  isDragging,
  setIsDragging,
}) => {
  //recoil
  const [trip, setTrip] = useRecoilState(tripAtom);
  const accessToken = getCookie("accessToken");
  useEffect(() => {
    // console.log("trip", trip);
  }, [trip]);
  //useNavigate
  const navigate = useNavigate();
  const handleClickSchedule = item => {
    console.log(item);
  };

  const navigateSearchContents = () => {
    navigate(`/search/trip?tripId=${tripId}`);
    console.log(data);
    // setTrip({ ...trip, nowTripId: tripId, lastSeq: data.schedules.length });
  };
  //useState
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState({
    lat: 35.868475,
    lng: 128.593743,
  });
  const [dayData, setDayData] = useState();
  const [memoModal, setMemoModal] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [isModalOpen, SetIsModalOpen] = useState(false);
  const [isClickMemoMenu, setIsClickMemoMenu] = useState(false);
  const [isEditingModal, setIsEditingModal] = useState(false);

  useEffect(() => {
    // console.log("메모 모달창", memoModal);
  }, [memoModal]);

  // 지도
  const scheduleArr = data?.schedules || [];
  const scheArr = scheduleArr.filter(item => item.scheOrMemo === "SCHE");

  // console.log(`${data.day} scheArr`, scheArr);
  const positions = scheArr?.map((item, index) => {
    return { title: item.strfTitle, latlng: { lat: item.lat, lng: item.lng } };
  });
  // console.log("positions", positions);
  const lineData = [positions.map(pos => pos.latlng)];
  const getCenterPoint = positions => {
    if (!positions.length) return { lat: 37.5665, lng: 126.978 }; // 빈 배열 예외 처리

    // 유효한 좌표만 필터링
    const validPositions = positions.filter(
      pos =>
        pos.latlng &&
        parseFloat(pos.latlng.lat) != null &&
        pos.latlng.lng != null,
    );

    if (!validPositions.length) return { lat: 37.5665, lng: 126.978 }; // 유효한 좌표가 없으면 기본값 반환

    const center = validPositions.reduce(
      (acc, pos) => {
        acc.lat += parseFloat(pos.latlng.lat);
        acc.lng += parseFloat(pos.latlng.lng);
        return acc;
      },
      { lat: 0, lng: 0 },
    );

    return {
      lat: center.lat / validPositions.length,
      lng: center.lng / validPositions.length,
    };
  };
  // 거리 계산해서 레벨 조절하기
  const validDistances = scheduleArr
    .filter(item => item.distance !== null)
    .map(item => item.distance);

  const averageDistance =
    validDistances.length > 0
      ? validDistances.reduce((sum, distance) => sum + distance, 0) /
        validDistances.length
      : 0;

  // console.log("평균 거리:", averageDistance);
  // 레벨 조절기
  const getKakaoMapLevel = averageDistance => {
    return averageDistance > 20000
      ? 10
      : averageDistance > 10000
        ? 9
        : averageDistance > 5000
          ? 8
          : 5;
  };

  useEffect(() => {
    const kakaoMapScript = document.createElement("script");
    kakaoMapScript.async = true;
    kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KKO_MAP_KEY}&autoload=false`;

    kakaoMapScript.addEventListener("load", () => {
      window.kakao.maps.load(() => {
        setIsMapLoaded(true);
      });
    });
    document.head.appendChild(kakaoMapScript);
    return () => {
      document.head.removeChild(kakaoMapScript);
    };
  }, []);

  //

  // console.log(scheduleArr[scheduleArr.length].seq);
  // 일정 추가 위해 출발
  const handleClickAddBt = () => {
    const lastSche = scheArr[scheArr.length - 1];
    const lastSeq = scheduleArr[scheduleArr.length - 1]?.seq || 0;
    console.log("lastSche", lastSche);
    console.log("lastSeq", lastSeq);
    // console.log(data.day);
    setTrip({
      ...trip,
      lastSeq: lastSeq,
      nowTripId: tripId,
      day: data.day,
      prevScheName: scheArr.length > 0 ? lastSche.strfTitle : "",
      prevSchelat: scheArr.length > 0 ? lastSche.lat : "",
      prevSchelng: scheArr.length > 0 ? lastSche.lng : "",
    });
    navigateSearchContents();
  };
  //메모 추가하기
  const postMemo = async content => {
    const lastSeq =
      data?.schedules?.length > 0
        ? data.schedules[data.schedules.length - 1].seq
        : 0;
    const sendData = {
      trip_id: trip.nowTripId,
      day: data.day,
      seq: lastSeq + 1,
      content: content,
    };
    console.log("accessToken", accessToken ? true : false);
    console.log("메모 데이터", sendData);
    try {
      const res = await jwtAxios.post(`/api/memo/post`, sendData);
      console.log("메모 추가", res.data);
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        getTrip();
      }
    } catch (error) {
      console.log("메모 추가", error);
    }
  };
  // 메모 삭제
  const deleteMemo = async item => {
    console.log(item);
    try {
      const res = await axios.delete(
        `/api/memo/delete?memoId=${item.scheduleMemoId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(res.data);
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        getTrip();
      }
    } catch (error) {
      console.log(error);
    }
  };
  //메모 수정
  const patchMemo = async content => {
    const sendData = {
      memo_id: selectedMemo.scheduleMemoId,
      trip_id: trip.nowTripId,
      content: content,
    };
    console.log("메모 수정 데이터", sendData);
    try {
      const res = await jwtAxios.patch(`/api/memo/upd`, sendData);
      console.log("메모 수정", res.data);
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        getTrip();
      }
    } catch (error) {
      console.log("메모 수정", error);
    }
  };
  // 일정 클릭
  const handleClickList = item => {
    console.log(item);
    navigate(`/contents/index?strfId=${item.strfId}`);
  };
  // 모달
  const handleClickMemoMenu = item => {
    setSelectedMemo(item);
    setIsClickMemoMenu(true);
  };
  const handleCloseMemoModal = () => {
    setMemoModal(false);
    setIsClickMemoMenu(false);
  };
  const handleCloseEditingModal = () => {
    setIsEditingModal(false);
    setMemoModal(false);
  };
  const handleCloseModalMenu = () => {
    setIsClickMemoMenu(false);
  };
  const handleClickCancle = () => {
    setIsClickMemoMenu(false);
  };
  const handleClickDelete = () => {
    deleteMemo(selectedMemo);
    setIsClickMemoMenu(false);
  };
  const handleClickPostMemo = content => {
    postMemo(content);
    setMemoModal(false);
  };
  const handleClickPatchMemo = content => {
    patchMemo(content);
    setMemoModal(false);
    setIsEditingModal(false);
    setIsClickMemoMenu(false);
  };

  if (!isMapLoaded) {
    return <div>지도를 불러오는 중입니다...</div>;
  }
  return (
    <div className="flex flex-col gap-[30px]">
      {/* 라인 */}
      <div className="h-[10px] bg-slate-100"></div>
      {/* 맵 */}
      {showMap ? (
        <div className="h-[292px] px-[32px]">
          <Map
            center={getCenterPoint(positions)}
            style={{ width: "100%", height: "100%", borderRadius: "8px" }}
            level={getKakaoMapLevel(averageDistance)}
          >
            {positions.map((position, index) => (
              <CustomOverlayMap
                key={`${position.title}-${index}`} // Unique key for each custom overlay
                position={position.latlng} // Position for the overlay
              >
                <div
                  className={`label text-white w-[20px] h-[20px]
                  flex items-center justify-center rounded-full
                  
                  ${dayBgColor(data?.day)}`}
                >
                  <span className="center font-medium text-white text-[12px]">
                    {index + 1}
                  </span>{" "}
                </div>
              </CustomOverlayMap>
            ))}
            <Polyline
              path={lineData}
              strokeWeight={3} // 선의 두께 입니다
              strokeColor={dayLineColor(data?.day)} // 선의 색깔입니다
              strokeOpacity={0.7} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
              strokeStyle={"solid"} // 선의 스타일입니다
            />
          </Map>
        </div>
      ) : null}

      <div className="flex flex-col gap-[20px] px-[32px]">
        {/* Day, 날짜, 날씨 */}
        <div className="flex items-center justify-between">
          <div className="flex gap-[10px] items-center">
            <h3
              className={`font-work-sans text-[24px] font-bold ${dayTextColor(data.day || index + 1)} `}
            >
              Day {data.day || index + 1}
            </h3>
            <span className="text-[18px] text-slate-700">{date}</span>
            <div className="w-[30px] h-[30px] flex items-center justify-center text-[30px]">
              {matchWeatherIcon(data?.weather)}
            </div>
          </div>
          {data.day === 1 && (
            <div>
              {isDragging ? (
                <button
                  type="button"
                  className={`text-[18px] leading-none border-b text-primary border-primary`}
                  onClick={() => setIsDragging(false)}
                >
                  완료
                </button>
              ) : (
                <button
                  type="button"
                  className={`text-[18px] leading-none border-b text-slate-700 border-slate-700`}
                  onClick={() => setIsDragging(true)}
                >
                  편집
                </button>
              )}
            </div>
          )}
        </div>
        {/* 일정 목록 */}
        <ul className="relative flex flex-col gap-[30px]">
          {scheduleArr?.map((item, itemIndex) => (
            <SortableScheduleItem
              key={item.scheduleMemoId}
              id={`${data.day}-${itemIndex}`}
              item={item}
              index={itemIndex}
              data={data}
              handleClickList={handleClickList}
              dayBgColor={dayBgColor}
              scheArr={scheArr}
              readOnly={readOnly}
              handleClickMemoMenu={handleClickMemoMenu}
              categoryKor={categoryKor}
              ProductPic={ProductPic}
              dayTextColor={dayTextColor}
              matchWeatherIcon={matchWeatherIcon}
            />
          ))}

          {/* 연결 라인 */}
          <div className="border-l border-slate-200 absolute left-[14px] top-1/2 -translate-y-1/2 h-[90%] -z-10"></div>
        </ul>
        {/* 추가 버튼 */}
        {newTrip ? (
          <div className="flex gap-[20px] items-center">
            <button
              type="button"
              className="flex items-center justify-center gap-[10px]
              py-[10px] rounded-lg
              w-full
              border border-slate-300
              text-slate-700 text-[22px] font-medium"
              onClick={handleClickAddBt}
            >
              <FaLocationDot className="text-slate-400 text-[18px]" />
              일정 추가
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-[10px]
              py-[10px] rounded-lg
              w-full
              border border-slate-300
              text-slate-700 text-[22px] font-medium"
              onClick={() => {
                setMemoModal(true);
              }}
            >
              <MdOutlineAutoAwesomeMotion className="text-slate-400 text-[18px]" />
              메모 추가
            </button>
          </div>
        ) : null}
      </div>
      {/* 모달창 */}
      {memoModal ? (
        <MemoModal
          setMemoModal={setMemoModal}
          tripId={tripId}
          data={data}
          getTrip={getTrip}
          setTripData={setTripData}
          handleClickSubmit={handleClickPostMemo}
          handleClickCancle={handleCloseMemoModal}
        />
      ) : null}
      {isClickMemoMenu ? (
        <BottomModal
          showButton={false}
          handleClickCancle={handleCloseModalMenu}
          modalContent={
            <div className="flex flex-col gap-[10px] w-full">
              <h3 className="text-[20px] font-semibold">메모 편집</h3>
              <ul className="flex flex-col gap-[10px] w-full">
                <li className="w-full">
                  <button
                    type="button"
                    className="text-[18px] text-slate-500"
                    onClick={() => setIsEditingModal(true)}
                  >
                    수정하기
                  </button>
                </li>
                <li className="w-full">
                  <button
                    type="button"
                    className="text-[18px] text-slate-500"
                    onClick={handleClickDelete}
                  >
                    삭제하기
                  </button>
                </li>
              </ul>
            </div>
          }
        />
      ) : null}
      {isEditingModal ? (
        <MemoModal
          selectedMemo={selectedMemo}
          setMemoModal={setMemoModal}
          tripId={tripId}
          data={data}
          getTrip={getTrip}
          setTripData={setTripData}
          handleClickCancle={handleCloseEditingModal}
          handleClickSubmit={handleClickPatchMemo}
        />
      ) : null}
    </div>
  );
};

// 새로운 SortableScheduleItem 컴포넌트 추가
const SortableScheduleItem = ({
  id,
  item,
  index,
  data,
  handleClickList,
  dayBgColor,
  scheArr,
  readOnly,
  handleClickMemoMenu,
  categoryKor,
  ProductPic,
  dayTextColor,
  matchWeatherIcon,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  const scheIndex = scheArr.findIndex(
    scheItem => scheItem.scheduleMemoId === item.scheduleMemoId,
  );

  // 메모 메뉴 버튼 클릭 핸들러
  const handleMemoMenuClick = (e, item) => {
    e.stopPropagation(); // 이벤트 전파 중단
    handleClickMemoMenu(item);
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...(item.scheOrMemo === "SCHE" ? { ...attributes, ...listeners } : {})}
      className={`${item.scheOrMemo === "SCHE" && isDragging ? "cursor-grabbing" : item.scheOrMemo === "SCHE" ? "cursor-grab" : ""}`}
    >
      <div className="flex flex-col gap-[30px] justify-center">
        {item.scheOrMemo === "SCHE" ? (
          // 기존 일정 표시 부분
          <div
            className="flex gap-[30px] items-center cursor-pointer"
            onClick={() => handleClickList(item)}
          >
            <div
              className={`w-[30px] h-[30px]
                          flex items-center justify-center  
                          rounded-full
                          text-[16px] text-white font-medium
                          ${dayBgColor(data?.day)}`}
            >
              {scheIndex !== -1 ? scheIndex + 1 : "없음"}
            </div>
            {/* 일정 정보 */}
            <div className="flex gap-[20px] items-center">
              {/* 이미지 */}
              <div className="w-[60px] h-[60px] bg-slate-200 rounded-lg overflow-hidden">
                <img
                  src={`${ProductPic}${item.strfId}/${item.picName}`}
                  alt="thum"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* 정보 */}
              <div>
                <h4 className="font-semibold text-[20px] text-slate-700">
                  {item.strfTitle}
                </h4>
                <div className="flex gap-[10px] items-center">
                  <p className="text-[14px] text-slate-500">
                    {categoryKor(item.category)}
                  </p>
                  <div className="flex gap-[10px] items-center">
                    <div className="flex gap-[5px] items-center">
                      <Rate
                        disabled
                        count={1}
                        value={item.reviewed ? 1 : 0}
                        style={{
                          width: "16px",
                          height: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />
                      {/* <p className="text-[12px] text-slate-500">평점</p>
                      <p className="text-[12px] text-slate-500">
                        ({(1000).toLocaleString()})
                      </p> */}
                    </div>
                    {/* <p className="flex gap-[5px] items-center">
                      <AiTwotoneHeart className="text-[16px]" />
                      <span className="text-[12px] text-slate-500">
                        찜하기 수
                      </span>
                    </p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : readOnly ? null : (
          // 기존 메모 표시 부분
          <div className="flex gap-[30px] items-center">
            {/* 점 */}
            <div className="w-[30px] h-[30px] flex items-center justify-center">
              <div
                className={`w-[10px] h-[10px] flex items-center justify-center rounded-full  text-[16px] text-white font-medium ${dayBgColor(data?.day)}`}
              ></div>
            </div>
            {/* 내용 */}
            <div
              className="flex  gap-[10px] justify-between
                    px-[40px] py-[20px] w-full rounded-2xl
                    bg-slate-50 "
            >
              <div className="flex flex-col gap-[10px]">
                <p className="flex gap-[5px] text-slate-700">
                  <IoReaderOutline className="text-slate-300 text-[18px]" />
                  {item.title}
                </p>
                <p className="text-[14px]">{item.content}</p>
              </div>

              <button
                type="button"
                onClick={e => handleMemoMenuClick(e, item)}
                className="z-10" // 높은 z-index 추가
              >
                <CgMoreVerticalAlt className="text-slate-300 text-[30px]" />
              </button>
            </div>
          </div>
        )}

        {/* 기존 path_type 표시 부분 */}
        {item.scheOrMemo === "SCHE" && (
          <div className="flex items-center">
            {/* 점 */}
            <div className="w-[30px] h-[30px] flex items-center justify-center">
              <div
                className={`w-[10px] h-[10px] flex items-center justify-center rounded-full  text-[16px] text-white font-medium ${dayBgColor(data?.day)}`}
              ></div>
            </div>
            {/* type */}
            <div
              className={`${item.pathType === null ? "h-[38px] flex gap-[10px] items-center px-[10px] bg-slate-50 rounded-2xl cursor-pointer" : "h-[38px] flex gap-[10px] items-center px-[10px] bg-white rounded-2xl"}`}
              onClick={() => {
                console.log(item);
              }}
            >
              <div
                className={`${item.pathType === null ? "text-slate-600 h-[18px]" : "text-slate-400 h-[18px]"}`}
              >
                {matchPathTypeIcon(item.pathType)}
              </div>
              <div
                className={`${item.pathType === null ? "text-[14px] text-slate-600 h-[18px]" : "text-[14px] text-slate-400 h-[18px]"}`}
              >
                {item.duration}
                {item.pathType > 0 ? "분" : ""}
              </div>
            </div>
          </div>
        )}
      </div>
    </li>
  );
};

export default memo(ScheduleDay);
