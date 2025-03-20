import { motion } from "framer-motion";
import { useRecoilState, useResetRecoilState } from "recoil";
import { tripAtom } from "../../atoms/tripAtom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "../../utils/cookie";
import { BiNavigation } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
import { matchPathTypeIcon } from "../../utils/match";
import { IAPI } from "../../types/interface";
import { Button } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";

interface PathProps {
  open: boolean;
  onClose: () => void;
}
interface PathData {
  pathType: string;
  payment: number;
  totalDistance: number;
  totalTime: number;
}

const Path = ({ open, onClose }: PathProps) => {
  console.log(open);
  // router
  const naviagate = useNavigate();
  // cookie
  const [searchParams] = useSearchParams();
  const strfId = searchParams.get("strfId");
  const accessToken = getCookie("accessToken");
  const [trip] = useRecoilState(tripAtom);
  const resetTrip = useResetRecoilState(tripAtom);
  console.log("trip", trip);
  const [pathList, setPathList] = useState<PathData[]>([]);
  const [pathcode, setPathcode] = useState("");
  const [selectedPath, setSelectedPath] = useState<number | null>(null);
  const [pathData, setPathData] = useState<PathData>();

  // api 길찾기
  const getPathList = async (): Promise<IAPI<PathData[]> | null> => {
    try {
      const res = await axios.get<IAPI<PathData[]>>(
        `/api/transport/get?startLngSX=${trip.prevSchelng}&startLatSY=${trip.prevSchelat}&endLngEX=${trip.nowLng}&endLatEY=${trip.nowLat}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const resultData = res.data;
      // console.log("길찾기 결과", resultData);

      setPathList(resultData.data);
      setPathcode(resultData.code);
      if (trip.lastSeq === 0) {
        createSchedule();
      }
      return resultData;
    } catch (error) {
      console.log("길찾기 결과", error);
      return null;
    }
  };
  // api 일정 등록
  const createSchedule = async () => {
    const url = "/api/schedule";
    const payload = {
      seq: trip.lastSeq + 1,
      day: trip.day,
      time:
        trip.lastSeq !== 0 && pathcode === "200 성공"
          ? pathData?.totalTime
          : null,
      distance:
        trip.lastSeq !== 0 && pathcode === "200 성공"
          ? pathData?.totalDistance
          : null,
      strf_id: strfId,
      trip_id: trip.nowTripId,
      path_type:
        trip.lastSeq !== 0 && pathcode === "200 성공"
          ? pathData?.pathType
          : null,
    };
    try {
      const res = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const resultData = res.data;
      if (resultData) {
        resetTrip();
        naviagate(`/schedule/index?tripId=${trip.nowTripId}`);
      }
    } catch (error) {
      console.log("일정 등록", error);
    }
  };
  // 시간 변환
  const formatMinutes = (totalMinutes: any) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}시간 ${minutes.toString().padStart(2, "0")}분`;
  };
  //  선택 완료
  const handleClickSubmit = () => {
    createSchedule();
  };
  useEffect(() => {
    getPathList();
  }, []);
  return (
    <motion.div
      tabIndex={-1}
      className="max-w-[768px] w-full left-1/2 -translate-x-1/2 fixed inset-0 bg-black/50 flex justify-center items-end z-[9999] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => onClose()} // ✅ 배경 클릭 시 onClose 실행
    >
      <motion.div
        className=" bg-white w-full rounded-t-3xl py-5 shadow-lg"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 100 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) onClose();
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="px-8">
          <h2 className="text-2xl text-slate-700 font-bold px-1 pt-8 pb-6">
            빠른 길 찾기
          </h2>
          {/* 길 시작-도착 */}
          <section>
            <ul
              className="flex flex-col w-full 
                      px-6 py-3 gap-3
                      border border-slate-300 rounded-2xl"
            >
              <li className="flex gap-3 items-center py-3">
                <BiNavigation className="text-slate-300 text-xl" />
                <span className="text-slate-700">{trip?.nowName}</span>
              </li>
              <li className="w-full h-[1px] bg-slate-100"></li>
              <li className="flex gap-3 items-center py-3">
                <FaLocationDot className="text-primary text-xl" />
                <span className="text-slate-700">{trip.prevScheName}</span>
              </li>
            </ul>
          </section>
          {/* 교통 수단 */}
          <section>
            {pathcode === "400 거리가 너무 가깝거나 잘못된 값입니다." && (
              <div
                className={`flex gap-5 items-center 
                          py-3
                          text-slate-700
                            rounded-lg`}
              >
                {pathcode}
              </div>
            )}
            {pathcode === "200 성공" && (
              <ul
                className="flex flex-col  py-5 gap-7
              max-h-[30vh] overflow-y-auto"
              >
                {pathList?.map((item, index) => {
                  return (
                    <li
                      className={`flex gap-5 items-center 
                          px-5 py-3
                          hover:bg-slate-50 cursor-pointer
                            rounded-lg
                            ${index === selectedPath ? "bg-slate-100" : "bg-white"}
                            `}
                      onClick={() => {
                        setSelectedPath(index);
                        console.log(item);
                        setPathData(item);
                      }}
                      key={index}
                    >
                      {/* 좌 */}
                      <div className="text-2xl text-slate-400">
                        {matchPathTypeIcon(item.pathType as string)}
                      </div>
                      {/* 우 */}
                      <ul className="flex gap-3 items-center">
                        <li className="text-slate-700 text-2xl font-semibold">
                          {item.totalTime > 60
                            ? formatMinutes(item.totalTime)
                            : `${item.totalTime}분`}
                        </li>
                        <li className="text-slate-700 text-base font-semibold">
                          {item.payment.toLocaleString()}원
                        </li>
                        <li className="font-medium text-sm text-slate-400">
                          {item.totalDistance > 1000
                            ? `${(item.totalDistance / 1000).toFixed(2)}km`
                            : `${item.totalDistance}m`}
                        </li>
                      </ul>
                    </li>
                  );
                })}
              </ul>
            )}
            {/* 완료 */}
            <div className="pb-5">
              <Button
                type="primary"
                htmlType="button"
                className="text-2xl py-5 max-h-[50px] h-[16vw] w-full text-white font-semibold"
                onClick={handleClickSubmit}
              >
                선택 완료
              </Button>
            </div>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Path;
