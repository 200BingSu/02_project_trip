import { useEffect, useState } from "react";
import { BiNavigation } from "react-icons/bi";
import { useRecoilState } from "recoil";
import { tripAtom } from "../../atoms/tripAtom";
import axios from "axios";
import { FaLocationDot } from "react-icons/fa6";
import { getCookie } from "../../utils/cookie";

import dayjs from "dayjs";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { matchPathTypeIcon } from "../../utils/match";

const PathModal = ({
  contentData,
  selectPath,
  setSelectPath,
  setOpenPathModal,
}) => {
  // cookie
  const accessToken = getCookie("accessToken");
  //recoil
  const [trip, setTrip] = useRecoilState(tripAtom);
  // anstD message
  const [messageApi, contextHolder] = message.useMessage();
  const error = () => {
    messageApi.open({
      type: "error",
      content: "This is an error message",
      style: {
        marginTop: "20vh",
      },
    });
  };
  // useNavigate
  const navigate = useNavigate();
  const navigateTrip = () => {
    navigate(`/schedule/index?tripId=${trip.nowTripId}`);
  };
  useEffect(() => {
    console.log("trip", trip);
  }, [trip]);
  //useState
  const [pathData, setPathData] = useState();
  const [nowSelected, setNowSelected] = useState(null);
  useEffect(() => {
    console.log(pathData);
  }, [pathData]);

  // 모달창
  const handleBackgroundClick = () => {
    setOpenPathModal(false);
  };
  const handleModalClick = e => {
    e.stopPropagation();
  };
  //   검색창
  const onChange = e => {};

  // 길찾기
  const getPathList = async () => {
    try {
      const res = await axios.get(
        `/api/transport/get?startLngSX=${trip.prevSchelng}&startLatSY=${trip.prevSchelat}&endLngEX=${contentData.longitude}&endLatEY=${contentData.latit}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const resultData = res.data;
      console.log("길찾기 결과", resultData);
      setPathData(resultData.data);
    } catch (error) {
      console.log("길찾기 결과", error);
    }
  };
  useEffect(() => {
    getPathList();
  }, []);
  // 일정 등록
  const postSchedule = async () => {
    const sendData = {
      seq: trip.lastSeq + 1,
      day: trip.day,
      time: selectPath.totalTime,
      distance: selectPath.totalDistance,
      strf_id: contentData.strfId,
      trip_id: trip.nowTripId,
      path_type: selectPath.pathType,
    };
    console.log("sendData", sendData);
    try {
      const res = await axios.post(
        `/api/schedule`,
        { ...sendData },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log("일정등록 결과", res.data);
      const resultData = res.data;
      if (resultData.code === "500 서버에러") {
        error();
        setOpenPathModal(false);
      }
      if (resultData.code === "200 성공") {
        setOpenPathModal(false);
        navigate(`/schedule/index?tripId=${trip.nowTripId}`);
      }
    } catch (error) {
      console.log("일정등록 결과", error);
    }
  };
  // 시간 변환
  const formatMinutes = totalMinutes => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}시간 ${minutes.toString().padStart(2, "0")}분`;
  };

  //리스트 클릭
  const handleClickList = item => {
    console.log(item);
    setSelectPath(item);
  };
  //  선택 완료
  const handleClickSubmit = () => {
    postSchedule();
  };
  useEffect(() => {
    console.log("선택한 교통", selectPath);
  }, [selectPath]);
  return (
    <div
      className="fixed top-0 left-[50%] translate-x-[-50%] z-10
                max-w-3xl w-full mx-auto h-screen
                flex items-end justify-center
                bg-[rgba(0,0,0,0.5)]
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
        <h2 className="text-[30px] text-slate-700 font-bold">빠른 길 찾기</h2>
        <ul
          className="flex flex-col w-full 
                      px-[26px] py-[10px] gap-[10px]
                      border border-slate-300 rounded-2xl"
        >
          <li className="flex gap-[10px] items-center py-[10px]">
            <BiNavigation className="text-slate-300 text-[20px]" />
            {contentData?.strfTitle}
          </li>
          <li className="w-full h-[1px] bg-slate-100"></li>
          <li className="flex gap-[10px] items-center py-[10px]">
            <FaLocationDot className="text-primary text-[20px]" />
            {trip.prevScheName}
          </li>
        </ul>
        {/* 교통 수단 */}
        <ul
          className="flex flex-col px-[10px] py-[20px] gap-[30px]
              max-h-[30vh] overflow-y-auto"
        >
          {pathData?.map((item, index) => {
            return (
              <li
                className={`flex gap-[20px] items-center 
                          px-[20px] py-[10px]
                          hover:bg-slate-50 cursor-pointer
                            rounded-lg
                            ${index === nowSelected ? "bg-slate-100" : "bg-white"}`}
                onClick={() => {
                  handleClickList(item);
                  setNowSelected(index);
                }}
                key={index}
              >
                {/* 좌 */}
                <div className="text-[30px] text-slate-400">
                  {matchPathTypeIcon(item.pathType)}
                </div>
                {/* 우 */}
                <ul className="flex gap-[10px] items-center">
                  <li className="text-slate-700 text-[24px] font-semibold">
                    {item.totalTime > 60
                      ? formatMinutes(item.totalTime)
                      : `${item.totalTime}분`}
                  </li>
                  <li className="text-slate-700 text-[16px] font-semibold">
                    {item.payment.toLocaleString()}원
                  </li>
                  <li className="font-medium text-[14px] text-slate-400">
                    {item.totalDistance > 1000
                      ? `${(item.totalDistance / 1000).toFixed(2)}km`
                      : `${item.totalDistance}m`}
                  </li>
                </ul>
              </li>
            );
          })}
        </ul>
        {/* 완료 */}
        <Button
          type="primary"
          htmlType="button"
          className="px-[15px] py-[20px] text-[24px] text-white font-semibold"
          onClick={handleClickSubmit}
        >
          선택 완료
        </Button>
      </div>
    </div>
  );
};
export default PathModal;
