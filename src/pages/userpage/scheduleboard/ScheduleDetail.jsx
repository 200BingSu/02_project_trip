import { useNavigate, useSearchParams } from "react-router-dom";
import TitleHeader, {
  RightContent,
} from "../../../components/layout/header/TitleHeader";
import { BiShow } from "react-icons/bi";
import { GoThumbsup } from "react-icons/go";
import { IoReaderOutline } from "react-icons/io5";
import ScheduleDay from "../../../components/scheduleboard/ScheduleDay";
import { Button, Spin } from "antd";
import { AiOutlineImport } from "react-icons/ai";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";
import { getCookie } from "../../../utils/cookie";
import { useEffect, useState } from "react";
import { TripReviewPic } from "../../../constants/pic";
import jwtAxios from "../../../apis/jwt";
import SelectTrip from "../../../components/scheduleboard/SelectTrip";
import Loading from "../../../components/loading/Loading";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../../atoms/userAtom";
import { RiAlarmWarningLine } from "react-icons/ri";
import { FiThumbsUp } from "react-icons/fi";
import { ReportType } from "../../../types/enum";

const ScheduleDetail = () => {
  const accessToken = getCookie("accessToken");
  //recoil
  const { userId } = useRecoilValue(userAtom);
  // 쿼리스트링
  const [searchParams] = useSearchParams();
  const tripId = parseInt(searchParams.get("tripId"));
  const tripReviewId = parseInt(searchParams.get("TripReviewId"));
  //useNavigate
  const navigate = useNavigate();
  const handleNavigateBack = () => {
    navigate(-1);
  };
  const navigateToReport = () => {
    navigate(
      `/report?category=${ReportType.TRIPREVIEW}&reportTarget=${tripReviewId}`,
    );
  };
  //useState
  const [tripReviewData, setTripReviewData] = useState({});
  const [tripData, setTripData] = useState({});
  const [openSelectTripModal, setOpenSelectTripModal] = useState(false);
  const [isTripLoading, setIsTripLoading] = useState(false);
  const [isTripReviewLoading, setIsTripReviewLoading] = useState(false);

  //다른 사용자의 여행기 조회
  const getOtherTripReview = async () => {
    const url = "/api/trip-review/otherTripReview";
    setIsTripReviewLoading(true);
    if (accessToken) {
      try {
        const res = await axios.get(`${url}?tripReviewId=${tripReviewId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log("다른 사람 여행기 조회", res.data);
        const resultData = res.data;
        setIsTripReviewLoading(false);
        setTripReviewData(resultData.data);
      } catch (error) {
        setIsTripReviewLoading(false);
        console.log("다른 사람 여행기 조회", error);
      }
    }
    if (!accessToken) {
      try {
        const res = await axios.get(`${url}?tripReviewId=${tripReviewId}`);
        console.log("다른 사람 여행기 조회", res.data);
        const resultData = res.data;
        setIsTripReviewLoading(false);
        setTripReviewData(resultData.data);
      } catch (error) {
        setIsTripReviewLoading(false);
        console.log("다른 사람 여행기 조회", error);
      }
    }
  };
  // 여행 확인하기
  const getTrip = async () => {
    setIsTripLoading(true);
    try {
      const res = await axios.get(`/api/trip?trip_id=${tripId}&signed=false`);
      console.log("여행확인하기", res.data);
      const resultData = res.data.data;
      setTripData(resultData);
      if (resultData) {
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsTripLoading(false);
    }
  };
  // api 여행기 추천
  const postTripReviewLike = async () => {
    const url = "/api/trip-review/like";
    const sendData = {
      tripReviewId: tripReviewId,
    };
    try {
      const res = await jwtAxios.post(url, sendData);
      console.log("여행기 추천", res.data);
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        getOtherTripReview();
      }
    } catch (error) {
      console.log("여행기 추천", error);
    }
  };
  // api 여행기 추천 취소
  const deleteTripReviewLike = async () => {
    const sendData = {
      tripReviewId: tripReviewId,
    };
    try {
      const res = await jwtAxios.delete(`/api/trip-review/like`, sendData);
      console.log("여행기 추천 취소", res.data);
      const resultData = res.data;
      if (resultData.status === 200) {
        getOtherTripReview();
      }
    } catch (error) {
      console.log("여행기 추천 취소", error);
    }
  };

  // useEffect
  useEffect(() => {
    getOtherTripReview();
    getTrip();
  }, []);

  // console.log(tripReviewData[0]?.tripReviewPics);

  return (
    <div>
      {/* 여행기 */}
      <section className="flex flex-col px-[32px] py-[30px] gap-[30px]">
        <Spin spinning={isTripReviewLoading}>
          {/* 이미지 */}
          <Swiper
            slidesPerView={1}
            spaceBetween={0}
            loop={true}
            className="mySwiper w-full h-[406px] overflow-hidden"
          >
            {tripReviewData.length > 0
              ? tripReviewData[0]?.tripReviewPics?.map((item, index) => {
                  return (
                    <SwiperSlide
                      key={index}
                      className="max-w-3xl h-[406px] bg-slate-200"
                    >
                      <img
                        src={`${TripReviewPic}/${tripReviewData[0].tripReviewId}/${item}`}
                        alt="thum"
                        className="w-full h-full object-cover"
                      />
                    </SwiperSlide>
                  );
                })
              : null}
          </Swiper>

          {/* info */}
          <div className="flex flex-col gap-[10px]">
            {/* <p className="text-[18px] text-slate-700">작성일자</p> */}
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-3">
                <h2 className="font-bold text-[36px] text-slate-700">
                  {tripReviewData[0]?.title}
                </h2>
                <ul className="flex gap-[10px] items-center">
                  <li className="flex gap-[5px] items-center">
                    <BiShow className="text-slate-300 text-[18px]" />
                    <p className="text-slate-500 font-bold text-[14px]">
                      {tripReviewData[0]?.recentCount}
                    </p>
                  </li>
                  <li className="flex gap-[5px] items-center cursor-pointer">
                    <GoThumbsup
                      className={`text-slate-300 text-[18px] focus:text-secondary3 transition-all duration-300`}
                    />
                    <button
                      type="button"
                      className="text-slate-500 font-bold text-[14px]"
                    >
                      {tripReviewData[0]?.likeCount}
                    </button>
                  </li>
                  <li className="flex gap-[5px] items-center">
                    <IoReaderOutline className="text-slate-300 text-[18px]" />
                    <p className="text-slate-500 font-bold text-[14px]">
                      {" "}
                      {tripReviewData[0]?.scrapCount}
                    </p>
                  </li>
                </ul>
              </div>
              <div className="flex gap-[10px]">
                {/* 좋아요 버튼 */}
                {accessToken && (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      className={`w-[50px] h-[50px] flex items-center justify-center
                    rounded-full text-[20px]
                   transition-all duration-300
                   ${
                     tripReviewData[0]?.likeUser === 1
                       ? "text-secondary3 bg-secondary3/10 hover:bg-secondary3/20"
                       : "text-slate-500 bg-slate-200 hover:bg-slate-200/85"
                   }`}
                      onClick={() => {
                        if (tripReviewData[0]?.likeUser === 0) {
                          postTripReviewLike();
                        } else {
                          deleteTripReviewLike();
                        }
                      }}
                    >
                      <FiThumbsUp />
                    </button>
                  </div>
                )}
                {accessToken && (
                  <button
                    type="button"
                    className={`w-[50px] h-[50px] flex items-center justify-center
                    rounded-full text-[20px] bg-slate-200 text-slate-500
                   transition-all duration-300
                   hover:bg-slate-200/85`}
                    onClick={navigateToReport}
                  >
                    <RiAlarmWarningLine />
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* 소개 */}
          <div className="py-3">
            <p>{tripReviewData[0]?.content}</p>
          </div>
        </Spin>
      </section>
      {/* 일정 */}
      <section>
        <Spin spinning={isTripLoading}>
          <div className="flex flex-col gap-[50px]">
            {tripData?.days?.map((item, index) => {
              return (
                <ScheduleDay
                  data={item}
                  key={index}
                  newTrip={false}
                  readOnly={true}
                />
              );
            })}
          </div>
        </Spin>
      </section>
      {/* 버튼 */}
      <div className="px-8 pb-5 mb-[30px]">
        <Button
          type="primary"
          variant="filled"
          className="flex gap-[10px] py-[10px] h-auto w-full"
          onClick={() => setOpenSelectTripModal(true)}
          classNames={`bg-slate-100`}
        >
          <AiOutlineImport className="w-[30px] h-[30px] text-white" />

          <span className="font-semibold text-[24px] text-white">
            내 여행에 담기
          </span>
        </Button>
      </div>
      {openSelectTripModal && (
        <SelectTrip
          openSelectTripModal={openSelectTripModal}
          setOpenSelectTripModal={setOpenSelectTripModal}
          tripLocationList={tripData?.tripLocationList}
          tripReviewId={tripReviewId}
        />
      )}
    </div>
  );
};

export default ScheduleDetail;
