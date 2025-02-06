import { Rate } from "antd";
import { useEffect, useState } from "react";
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

// defaultData(days[0])
const defaultData = {
  day: 1,
  weather: "sunny",
  schedules: [
    {
      seq: 1,
      strfId: 9,
      strfTitle: "제목",
      category: "카테고리",
      address: "주소",
      lat: 37.570083,
      lng: 126.99022,
      distance: 2000,
      duration: 30,
      pathType: "도보",
    },
    {
      seq: 2,
      strfId: 9,
      strfTitle: "제목",
      category: "카테고리",
      address: "주소",
      lat: 37.570083,
      lng: 126.99022,
      distance: 2000,
      duration: 30,
      pathType: "도보",
    },
    {
      seq: 3,
      strfId: 9,
      strfTitle: "제목",
      category: "카테고리",
      address: "주소",
      lat: 37.570083,
      lng: 126.99022,
      distance: 2000,
      duration: 30,
      pathType: "도보",
    },
  ],
};
// day 색깔
export const dayTextColor = dayNum => {
  switch (dayNum % 3) {
    case 1:
      return "text-primary";
    case 2:
      return "text-secondary2";
    case 0:
      return "text-secondary3";
    default:
      return "black";
  }
};
export const dayBgColor = dayNum => {
  switch (dayNum % 3) {
    case 1:
      return "bg-primary";
    case 2:
      return "bg-secondary2";
    case 0:
      return "bg-secondary3";
    default:
      return "black";
  }
};
export const dayLineColor = dayNum => {
  switch (dayNum % 3) {
    case 1:
      return "#0DD1FD";
    case 2:
      return "#6B4AD6";
    case 0:
      return "#FB653D";
    default:
      return "black";
  }
};
// pathType 아이콘
export const matchPathTypeIcon = pathType => {
  switch (pathType) {
    case "지하철": //지하철
      return <FaTrainSubway />;
    case "버스": //버스
      return <BiSolidBus />;
    case "버스+지하철": //버스+지하철
      return <BiSolidBus />;
    case "열차": //열차
      return <BiSolidTrain />;
    case "시외버스":
      return <BiSolidBus />;
    case "시외교통 복합(기차 + 시외버스)":
      return <BiSolidTrain />;
    case "항공": //항공
      return <FaWalking />;
    default:
      return <BiNavigation />;
  }
};
// 날씨 아이콘
export const matchWeatherIcon = weather => {
  switch (weather) {
    case "sunny":
      return <img src="/public/images/weathericon/sunny.svg" alt="sunny" />;
    case "cloudy":
      return <img src="/public/images/weathericon/cloudy.svg" alt="cloudy" />;
    case "overcast":
      return (
        <img src="/public/images/weathericon/overcast.svg" alt="overcast" />
      );
    case "rain":
      return <img src="/public/images/weathericon/rain.svg" alt="rain" />;
    case "snow":
      return <img src="/public/images/weathericon/snow.svg" alt="snow" />;
    default:
      return "";
  }
};

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
}) => {
  //recoil
  const [trip, setTrip] = useRecoilState(tripAtom);
  const accessToken = getCookie("accessToken");
  useEffect(() => {
    console.log("trip", trip);
  }, [trip]);
  //useNavigate
  const navigate = useNavigate();
  const handleClickSchedule = item => {
    console.log(item);
  };

  const navigateSearchContents = () => {
    navigate(`/search/trip?tripId=${tripId}`);
    console.log(data);
    setTrip({ nowTripId: tripId, lastSeq: data.schedules.length });
  };
  //useState
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState({
    lat: 35.868475,
    lng: 128.593743,
  });
  const [dayData, setDayData] = useState();
  const [memoModal, setMemoModal] = useState(false);
  useEffect(() => {
    // console.log("메모 모달창", memoModal);
  }, [memoModal]);

  // 지도
  const scheduleArr = data?.schedules || [];
  const scheArr = scheduleArr.filter(item => item.scheOrMemo === "SCHE");
  console.log(`${data.day} scheArr`, scheArr);
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
  if (!isMapLoaded) {
    return <div>지도를 불러오는 중입니다...</div>;
  }
  //

  // console.log(scheduleArr[scheduleArr.length].seq);
  // 일정 추가 위해 출발
  const handleClickAddBt = () => {
    const lastSche = scheArr[scheArr.length - 1];
    const lastSeq = scheduleArr[scheduleArr.length - 1]?.seq;
    console.log("lastSche", lastSche);
    console.log("lastSeq", lastSeq);
    setTrip({
      ...trip,
      lastSeq: lastSeq,
      nowTripId: tripId,
      day: data.day,
      prevScheName: scheArr.length > 0 ? lastSche.strfTitle : "",
      prevSchelat: scheArr.length > 0 ? lastSche.lat : "",
      prevSchelng: scheArr.length > 0 ? lastSche.lng : "",
    });
    // navigateSearchContents();
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

  return (
    <div className="flex flex-col gap-[30px]">
      {/* 라인 */}
      {/* <div className="h-[10px] bg-slate-100"></div> */}
      {/* 맵 */}
      {showMap ? (
        <div className="h-[292px] px-[32px]">
          <Map
            center={getCenterPoint(positions)}
            style={{ width: "100%", height: "100%", borderRadius: "8px" }}
            level={8}
          >
            {/* {scheduleArr.map((item, index) => {
              return;
            })} */}
            {/* {positions.map((position, index) => (
            <MapMarker
              key={`${position.title}-${position.latlng}`}
              position={position.latlng} // 마커를 표시할 위치
              title={position.title} // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            />
          ))} */}
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
        <div className="flex gap-[10px] items-center">
          <h3
            className={`font-work-sans text-[24px] font-bold ${dayTextColor(data?.day)} `}
          >
            Day {data?.day}
          </h3>
          <span className="text-[18px] text-slate-700">{startAt}</span>
          <div className="w-[30px] h-[30px] flex items-center justify-center text-[30px]">
            {matchWeatherIcon(data?.weather)}
          </div>
        </div>
        {/* 일정 목록 */}
        <ul className="relative flex flex-col gap-[30px]">
          {scheduleArr?.map((item, index) => {
            return (
              <li
                key={index}
                className="flex flex-col gap-[30px] justify-center "
              >
                {/* 일정 또는 메모 */}
                {item.scheOrMemo === "SCHE" ? (
                  // 일정
                  <div className="flex gap-[30px] items-center">
                    <div
                      className={`w-[30px] h-[30px]
                                  flex items-center justify-center  
                                  rounded-full
                                  text-[16px] text-white font-medium
                                  ${dayBgColor(data?.day)}`}
                    >
                      {index + 1}
                    </div>
                    {/* 일정 정보 */}
                    <div className="flex gap-[20px] items-center">
                      {/* 이미지 */}
                      <div className="w-[60px] h-[60px] bg-slate-200 rounded-lg">
                        <img src="" alt="thum" />
                      </div>
                      {/* 정보 */}
                      <div>
                        <h4 className="font-semibold text-[20px] text-slate-700">
                          {item.strfTitle}
                        </h4>
                        <div className="flex gap-[10px] items-center">
                          <p className="text-[14px] text-slate-500">
                            {item.category}
                          </p>
                          <div className="flex gap-[10px] items-center">
                            <div className="flex gap-[5px] items-center">
                              <Rate
                                count={1}
                                value={0}
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              />
                              <p className="text-[12px] text-slate-500">평점</p>
                              <p className="text-[12px] text-slate-500">
                                ({(1000).toLocaleString()})
                              </p>
                            </div>
                            <p className="flex gap-[5px] items-center">
                              <AiTwotoneHeart className="text-[16px]" />
                              <span className="text-[12px] text-slate-500">
                                찜하기 수
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // 메모
                  <div className="flex gap-[30px] items-center">
                    {/* 점 */}
                    <div className="w-[30px] h-[30px] flex items-center justify-center">
                      <div
                        className={`w-[10px] h-[10px] flex items-center justify-center rounded-full  text-[16px] text-white font-medium ${dayBgColor(data?.day)}`}
                      ></div>
                    </div>
                    {/* 내용 */}
                    <div
                      className="flex flex-col gap-[10px] justify-center
                  px-[20px] py-[20px] w-full rounded-2xl
                  bg-slate-50 "
                    >
                      <p className="flex gap-[5px] text-slate-700">
                        <IoReaderOutline className="text-slate-300 text-[18px]" />
                        {item.title}
                      </p>
                      <p className="text-[14px]">{item.content}</p>
                      <button type="button" onClick={() => deleteMemo(item)}>
                        삭제
                      </button>
                    </div>
                  </div>
                )}

                {/* path_type */}
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
                      {item.pathType ? "분" : "길찾기"}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
          {/* 연결 라인 */}
          <div
            className="border-l border-slate-200
                                absolute left-[14px] top-1/2 -translate-y-1/2
                                h-[90%] -z-10"
          ></div>
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
        />
      ) : null}
    </div>
  );
};

export default ScheduleDay;
