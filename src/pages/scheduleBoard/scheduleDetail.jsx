import { useNavigate, useSearchParams } from "react-router-dom";
import TitleHeader, {
  RightContent,
} from "../../components/layout/header/TitleHeader";
import { BiShow } from "react-icons/bi";
import { GoThumbsup } from "react-icons/go";
import { IoReaderOutline } from "react-icons/io5";
import ScheduleDay from "../../components/scheduleboard/ScheduleDay";
import { Button } from "antd";
import { AiOutlineImport } from "react-icons/ai";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";
import { getCookie } from "../../utils/cookie";
import { useEffect, useState } from "react";
import { TripReviewPic } from "../../constants/pic";
import jwtAxios from "../../apis/jwt";
import SelectTrip from "../../components/scheduleboard/SelectTrip";
import Loading from "../../components/loading/Loading";

const ScheduleDetail = () => {
  const accessToken = getCookie("accessToken");
  // 쿼리스트링
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("tripId");
  const TripReviewId = searchParams.get("TripReviewId");
  //useNavigate
  const navigate = useNavigate();
  const handleNavigateBack = () => {
    navigate(-1);
  };
  //useState
  const [tripReviewData, setTripReviewData] = useState({});
  const [tripData, setTripData] = useState({});
  const [openSelectTripModal, setOpenSelectTripModal] = useState(false);
  const [isTripLoading, setIsTripLoading] = useState(false);
  const [isTripReviewLoading, setIsTripReviewLoading] = useState(false);

  //다른 사용자의 여행기 조회
  const getOtherTripReview = async () => {
    try {
      const res = await axios.get(
        `/api/trip-review/otherTripReview?tripReviewId=${TripReviewId}`,
      );
      // console.log("다른 사람 여행기 조회", res.data);
      const resultData = res.data;
      setTripReviewData(resultData.data);
      if (resultData) {
        setIsTripReviewLoading(true);
      }
    } catch (error) {
      console.log("다른 사람 여행기 조회", error);
    }
  };
  // 여행 확인하기
  const getTrip = async () => {
    try {
      const res = await axios.get(`/api/trip?trip_id=${tripId}&signed=false`);
      console.log("여행확인하기", res.data);
      const resultData = res.data.data;
      setTripData(resultData);
      if (resultData) {
        setIsTripLoading(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOtherTripReview();
    getTrip();
  }, []);

  // console.log(tripReviewData[0]?.tripReviewPics);

  return (
    <div>
      {isTripLoading && isTripReviewLoading ? (
        <>
          <TitleHeader
            icon="back"
            onClick={handleNavigateBack}
            rightContent={<RightContent />}
          />
          {/* 여행기 */}
          <div className="flex flex-col px-[32px] py-[30px] gap-[30px]">
            {/* 이미지 */}
            <Swiper
              slidesPerView={1}
              spaceBetween={0}
              loop={true}
              className="mySwiper w-full h-[406px] px-[32px] overflow-hidden"
            >
              {tripReviewData.length > 0
                ? tripReviewData[0]?.tripReviewPics?.map((item, index) => {
                    return (
                      <SwiperSlide
                        key={index}
                        className="max-w-3xl h-[406px] bg-slate-200"
                      >
                        <img
                          src={`${TripReviewPic}${tripReviewData[0].tripReviewId}/${item}`}
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
              <div>
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
                  <li className="flex gap-[5px] items-center">
                    <GoThumbsup className="text-slate-300 text-[18px]" />
                    <p className="text-slate-500 font-bold text-[14px]">
                      {tripReviewData[0]?.likeCount}
                    </p>
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
            </div>
            {/* 소개 */}
            <div>
              <p>{tripReviewData[0]?.content}</p>
            </div>
          </div>
          {/* 일정 */}
          <div>
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
          </div>
          {/* 버튼 */}
          <div className="px-[32px] mb-[30px]">
            <Button
              variant="filled"
              className="flex gap-[10px] py-[10px] h-auto w-full"
              onClick={() => setOpenSelectTripModal(true)}
              classNames={`bg-slate-100`}
              disabled
            >
              <AiOutlineImport className="w-[30px] h-[30px] text-slate-400" />

              <span className="font-semibold text-[24px] text-slate-400">
                업데이트 예정인 메뉴입니다
              </span>
            </Button>
          </div>
          {openSelectTripModal && (
            <SelectTrip
              openSelectTripModal={openSelectTripModal}
              setOpenSelectTripModal={setOpenSelectTripModal}
              tripLocationList={tripData?.tripLocationList}
            />
          )}
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default ScheduleDetail;
