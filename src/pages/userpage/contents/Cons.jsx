import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { CONTENT, TRIP } from "../../../constants/api";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  FaBath,
  FaBed,
  FaComputer,
  FaFireExtinguisher,
  FaHotTubPerson,
  FaHouseFloodWater,
  FaLocationDot,
  FaTrainSubway,
} from "react-icons/fa6";
import { FaSwimmingPool } from "react-icons/fa";
import { message, Modal, Rate, Skeleton, Tabs } from "antd";
import {
  AiFillHeart,
  AiOutlineFundView,
  AiOutlineHeart,
  AiOutlineSafety,
  AiTwotoneHeart,
} from "react-icons/ai";
import { BiBlanket, BiSolidEditAlt, BiTime, BiWifi } from "react-icons/bi";
import { BiDownload } from "react-icons/bi";
import {
  IoIosArrowDown,
  IoIosArrowRoundForward,
  IoIosArrowUp,
  IoIosBed,
  IoIosClose,
} from "react-icons/io";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import Partnership from "../../../components/common/Partnership";
import Menu from "../../../components/contents/Menu";
import BusinessTime from "../../../components/contents/BusinessTime";
import {
  PiCookingPot,
  PiForkKnifeBold,
  PiHandSoapBold,
  PiMonitorBold,
  PiWashingMachineBold,
} from "react-icons/pi";
import { CgSmartHomeRefrigerator } from "react-icons/cg";
import { BsThermometerHalf } from "react-icons/bs";
import DetailInfo from "../../../components/contents/DetailInfo";
import Reviews from "../../../components/contents/Reviews";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../../../atoms/userAtom";
import ContentsHeader from "../../../components/layout/header/ContentsHeader";
import ScheduleModal from "../../../components/contents/ScheduleModal";
import AmenityModal from "../../../components/contents/AmenityModal";
import { tripAtom } from "../../../atoms/tripAtom";
import jwtAxios from "../../../apis/jwt";
import { getCookie } from "../../../utils/cookie";
import PathModal from "../../../components/schedule/PathModal";
import { ProductPic } from "../../../constants/pic";
import { GiPillow } from "react-icons/gi";
import { categoryKor, matchAmenitiesIcon } from "../../../utils/match";
import Loading from "../../../components/loading/Loading";
import { moveTo } from "../../../utils/moveTo";

dayjs.extend(isBetween);
const accessToken = getCookie("accessToken");

const ContentIndex = () => {
  // antD
  const [messageApi, contextHolder] = message.useMessage();
  const success = useCallback(() => {
    messageApi.open({
      type: "success",
      content: "일정 추가가 완료되었습니다",
      style: {
        marginTop: "20vh",
      },
    });
  }, [messageApi]);
  // 쿼리 스트링 조회
  const [searchParams] = useSearchParams();

  const strfId = parseInt(searchParams.get("strfId"));
  // recoil
  const { userId } = useRecoilValue(userAtom);

  const [trip, setTrip] = useRecoilState(tripAtom);
  useEffect(() => {
    // console.log("trip", trip);
  }, [trip]);
  // useNavigate
  const navigate = useNavigate();
  const navigateToBack = () => {
    navigate(-1);
  };
  const navigatePostReview = () => {
    navigate(`/contents/postreview?strfId=${strfId}`, { state: contentData });
  };
  const navigateTrip = () => {
    navigate(`/schedule/index?tripId=${trip.nowTripId}`);
  };
  const location = useLocation();
  const locationState = location.state;
  //useState
  const [contentData, setContentData] = useState({});

  const [isDetailOpen, setIsDetailOpen] = useState(true);
  const [isRegistModalOpen, setIsRegistModalOpen] = useState(false);
  const [openBusinessTime, setOpenBusinessTime] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectPath, setSelectPath] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  // const [reviewsData, setReviewsData] = useState([]);
  // const [reviewIndex, setReviewIndex] = useState(6);
  const [pathCode, setPathCode] = useState("");
  const [pathData, setPathData] = useState();

  const [openPathModal, setOpenPathModal] = useState(false);

  useEffect(() => {
    if (trip.nowTripId !== 0) {
      getPathList();
    }
  }, [contentData]);

  // useRef
  const imgRef = useRef(null);
  const reviewRef = useRef(null);

  // 편의 시설 모달
  const showModal = () => {
    setIsModalOpen(true);
    document.body.style.overflowY = "scroll"; // 혹은 'auto'
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // 일정 등록
  const postSchedule = async () => {
    const sendData = {
      seq: trip.lastSeq + 1,
      day: trip.day ? trip.day : 1,
      time: selectPath.totalTime ? selectPath.totalTime : null,
      distance: selectPath.totalDistance ? selectPath.totalDistance : null,
      strf_id: contentData.strfId,
      trip_id: trip.nowTripId,
      path_type: selectPath.path_type ? selectPath.path_type : null,
    };
    console.log("sendData", sendData);
    try {
      const res = await jwtAxios.post(`/api/schedule`, { ...sendData });
      console.log("일정등록 결과", res.data);
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        success();
      }
    } catch (error) {
      console.log("일정등록 결과", error);
    }
  };
  // 일정 추가 클릭
  const showRegistModal = () => {
    if (trip.nowTripId === 0) {
      setIsRegistModalOpen(true);
    } else if (
      trip.lastSeq > 0
      //  && pathCode === "200 성공"
    ) {
      setOpenPathModal(true);
    } else {
      postSchedule();
      navigate(`/schedule/index?tripId=${trip.nowTripId}`);
    }
  };
  const handleRegistOk = () => {
    setIsRegistModalOpen(false);
  };
  const handleRegistCancel = () => {
    setIsRegistModalOpen(false);
  };
  // 리뷰 등록 모달
  const showReviewModal = () => {
    setIsReviewModalOpen(true);
    navigatePostReview();
  };
  const handleReviewOk = () => {
    setIsReviewModalOpen(false);
  };
  const handleReviewCancel = () => {
    setIsReviewModalOpen(false);
  };

  // 상품 조회(비회원)
  // const getDetailGuest = async () => {
  //   try {
  //     const res = await axios.get(`/api/detail/member/non?strf_id=${strfId}`);
  //     const resultData = res.data.data;
  //     console.log("상품조회-비회원", resultData);

  //     setContentData(resultData);
  //     if (res.data.code === "200 성공") {
  //       setIsLoading(true);
  //       getPathList();
  //     }
  //   } catch (error) {
  //     console.log("상품조회-비회원", error);
  //   }
  // };
  // 상품조회(회원)
  const getDetailMember = async () => {
    if (accessToken) {
      try {
        const res = await jwtAxios.get(`/api/detail/member?&strf_id=${strfId}`);
        const resultData = res.data.data;
        console.log("상품조회-회원", resultData);
        setContentData(resultData);
        if (res.data.code === "200 성공") {
          setIsLoading(true);
        }
      } catch (error) {
        console.log("상품조회-회원", error);
      }
    } else {
      try {
        const res = await axios.get(`/api/detail/member?&strf_id=${strfId}`);
        const resultData = res.data.data;
        console.log("상품조회-비회원", resultData);
        setContentData(resultData);
        if (res.data.code === "200 성공") {
          setIsLoading(true);
        }
      } catch (error) {
        console.log("상품조회-회원", error);
      }
    }
  };

  // 길찾기
  const getPathList = async () => {
    try {
      const res = await jwtAxios.get(
        `/api/transport/get?startLngSX=${trip.prevSchelng}&startLatSY=${trip.prevSchelat}&endLngEX=${contentData.longitude}&endLatEY=${contentData.latit}`,
      );
      const resultData = res.data;
      // console.log("길찾기 결과", resultData);
      setPathCode(resultData.code);

      setPathData(resultData.data);
    } catch (error) {
      console.log("길찾기 결과", error);
    }
  };
  // 검색 지우기
  const onChange = key => {
    console.log(key);
  };
  // 리뷰로
  const moveTo = ref => {
    console.log(ref);
    console.log(`${ref}로 이동`);
    ref.current.scrollIntoView({ behavior: "smooth" });
    setIsDetailOpen(false);
  };
  //useEffect
  useEffect(() => {
    getDetailMember();
  }, []);

  return (
    <div className="relative">
      {isLoading ? (
        <>
          {/* 헤더 */}
          <ContentsHeader
            contentData={contentData}
            strfId={strfId}
            getDetailMember={getDetailMember}
          />
          {/* 메인 썸네일 */}
          <div className="w-full max-h-[467px] h-[93.33vw] bg-gray-200">
            <img
              src={
                contentData?.strfPics?.[0]?.pic
                  ? `${ProductPic}/${strfId}/${contentData.strfPics[0].pic}`
                  : ""
              }
              alt={contentData?.strfTitle || ""}
              className="w-full h-full object-cover"
              ref={imgRef}
            />
          </div>
          {/* 컨텐츠 영역 */}
          <div className="w-full flex flex-col gap-[30px] px-[32px] py-[30px]">
            {/* 카테고리, 업체명, 주소, 별점, 찜하기, 영업시간 */}
            <div className="w-full flex flex-col gap-[10px]">
              {/* 카테고리 */}
              <div className="text-sm text-slate-500">
                {categoryKor(contentData?.category || "STAY")}
              </div>
              {/* 컨텐츠 타이틀 */}
              <div className="font-semibold text-2xl text-slate-700 line">
                {contentData?.strfTitle || "제목"}
              </div>
              {/* 주소 */}
              <div className="flex gap-[5px] items-center">
                <FaLocationDot className="text-base text-slate-300" />
                <p className="text-base text-slate-500">
                  {contentData?.locationName || "주소"}
                </p>
              </div>
              {/* 별점 및 찜하기*/}
              <div className="flex gap-[20px] items-center">
                {/* 별점 */}
                <div className="flex gap-[5px] items-center">
                  <Rate disabled count={1} value={1} />
                  <p className="text-base text-slate-700 font-semibold">
                    {contentData?.ratingAvg}
                  </p>
                  <p
                    className="text-base text-primary underline"
                    onClick={() => {
                      moveTo(reviewRef);
                    }}
                  >
                    리뷰{" "}
                    {(contentData.reviewCnt
                      ? contentData.reviewCnt
                      : 0
                    ).toLocaleString()}
                    개
                  </p>
                </div>
                <p className="text-base text-slate-300 font-light">|</p>
                {/* 찜하기 */}
                <div className="flex gap-[5px] items-center">
                  {contentData?.wishIn ? (
                    <AiFillHeart className="text-secondary3" />
                  ) : (
                    <AiOutlineHeart className="text-slate-400" />
                  )}

                  <p className="text-[16px] text-slate-700">
                    {contentData?.wishCnt === 0
                      ? "0"
                      : (contentData?.wishCnt || 0).toLocaleString()}
                  </p>
                </div>
              </div>
              {/* 영업 시간 */}
              <BusinessTime
                type={contentData?.category}
                contentData={contentData}
                openBusinessTime={openBusinessTime}
                setOpenBusinessTime={setOpenBusinessTime}
              />
            </div>
            {/* 쿠폰 */}
            {contentData?.category === "STAY" && (
              <div className="w-full flex flex-col gap-[30px]">
                <div
                  className="w-full flex gap-[10px] 
                        items-center justify-between
                        px-[20px] py-[16px] rounded-2xl 
                        bg-white border border-slate-200 shadow-[0_0_7px_0_rgba(0,0,0,0.2)]"
                >
                  <p className="text-[18px] font-semibold">최대 n% 할인</p>
                  <button
                    type="button"
                    className="flex gap-[10px] items-center px-[15px] py-[10px] rounded-3xl bg-secondary2 text-white text-[16px] font-semibold"
                  >
                    <BiDownload />
                    쿠폰 받기
                  </button>
                </div>

                <div className="w-full h-[10px] bg-slate-100"></div>
              </div>
            )}
            {/* 메뉴 */}
            <Menu
              type={contentData?.category}
              strfId={strfId}
              contentData={contentData}
            />
            {/* 편의 시설 및 서비스 */}
            {contentData?.category === "STAY" && (
              <div className="flex flex-col">
                <div className="flex flex-col gap-[20px]">
                  <div className="flex gap-[5px] items-center justify-between">
                    <h2 className="text-[28px] font-semibold">
                      편의 시설 및 서비스
                    </h2>
                    <button
                      type="button"
                      className="flex gap-[10px] items-center text text-slate-400"
                      onClick={showModal}
                    >
                      더보기 <IoIosArrowRoundForward />
                    </button>
                  </div>
                  {/* 편의시설 리스트 */}
                  <ul className="flex flex-wrap w-full">
                    {contentData ? (
                      contentData.amenities.map((item, index) => {
                        return (
                          <li
                            className="flex flex-col gap-[10px] items-center w-[117px] min-w-[117px] h-[102px]"
                            key={index}
                          >
                            <div className="text-[24px] text-slate-700">
                              {matchAmenitiesIcon(item.amenityId)}
                            </div>
                            <p className="text-slate-700">
                              {item.amenityTitle}
                            </p>
                          </li>
                        );
                      })
                    ) : (
                      <li className="flex flex-col gap-[10px] items-center">
                        <div>
                          <FaBed />
                        </div>
                        <p>침대</p>
                      </li>
                    )}
                  </ul>
                </div>
                {/* 라인 */}
                <div className="w-full h-[10px] bg-slate-100"></div>
              </div>
            )}

            {/* 상세정보 및 리뷰 선택 */}
            <div
              className="w-full flex items-center justify-center"
              ref={reviewRef}
            >
              <button
                type="button"
                onClick={() => {
                  setIsDetailOpen(true);
                }}
                className={`w-full text-[16px] h-[60px] pt-[17px] pb-[16px]
                    ${isDetailOpen ? "text-primary" : "text-slate-400"}
                    ${isDetailOpen ? "border-b-2 border-primary" : "border-b-1 border-slate-200"}`}
              >
                상세보기
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDetailOpen(false);
                }}
                className={`w-full text-[16px] h-[60px] pt-[17px] pb-[16px]
                    ${isDetailOpen ? "text-slate-400" : "text-primary"}
                    ${isDetailOpen ? "border-b border-slate-200" : "border-b-2 border-primary"}`}
              >
                리뷰
              </button>
            </div>
            {/* 컨텐츠 영역 컨텐츠 */}
            {isDetailOpen && <DetailInfo contentData={contentData} />}
            {!isDetailOpen && (
              <Reviews
              // reviewsData={reviewsData}
              // setReviewsData={setReviewsData}
              // reviewIndex={reviewIndex}
              // setReviewIndex={setReviewIndex}
              />
            )}
          </div>
          {/* 일정 추가 및 리뷰쓰기 버튼 */}
          {accessToken ? (
            <div
              className="flex items-center justify-between gap-[10px]
                        w-full mx-auto
                        px-4 py-[20px]
                        sticky bottom-0 left-0 z-10
                        bg-white"
            >
              <button
                type="button"
                className="w-full flex gap-[10px] py-[14px]
                border border-slate-300 rounded-lg items-center justify-center
                bg-white"
                onClick={showRegistModal}
              >
                <FaLocationDot className="text-slate-400" />
                <p className="text-lg text-slate-700 font-medium">일정 추가</p>
              </button>
              <button
                type="button"
                className="w-full flex gap-[10px] py-[14px] 
                border border-slate-300 rounded-lg items-center justify-center
                bg-white"
                onClick={() => {
                  showReviewModal();
                }}
              >
                <BiSolidEditAlt className="text-slate-400" />
                <p className="text-lg text-slate-700 font-medium">리뷰 쓰기</p>
              </button>
            </div>
          ) : null}

          {/* 일정 추가 모달창 */}
          {isRegistModalOpen ? (
            <ScheduleModal handleRegistCancel={handleRegistCancel} />
          ) : null}

          {openPathModal ? (
            <PathModal
              pathCode={pathCode}
              pathData={pathData}
              setPathData={setPathData}
              setOpenPathModal={setOpenPathModal}
              contentData={contentData}
              selectPath={selectPath}
              setSelectPath={setSelectPath}
            />
          ) : null}
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};
export default ContentIndex;
