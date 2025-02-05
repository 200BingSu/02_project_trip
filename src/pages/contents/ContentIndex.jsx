import { useNavigate, useSearchParams } from "react-router-dom";
import { CONTENT, TRIP } from "../../constants/api";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  FaBath,
  FaBed,
  FaFireExtinguisher,
  FaLocationDot,
} from "react-icons/fa6";
import { FaSwimmingPool } from "react-icons/fa";
import { Modal, Rate, Skeleton, Tabs } from "antd";
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
  IoIosClose,
} from "react-icons/io";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import Partnership from "../../components/common/Partnership";
import Menu from "../../components/contents/Menu";
import BusinessTime from "../../components/contents/BusinessTime";
import {
  PiCookingPot,
  PiForkKnifeBold,
  PiHandSoapBold,
  PiMonitorBold,
  PiWashingMachineBold,
} from "react-icons/pi";
import { CgSmartHomeRefrigerator } from "react-icons/cg";
import { BsThermometerHalf } from "react-icons/bs";
import DetailInfo from "../../components/contents/DetailInfo";
import Reviews from "../../components/contents/Reviews";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../../atoms/userAtom";
import ContentsHeader from "../../components/layout/header/ContentsHeader";
import ScheduleModal from "../../components/contents/ScheduleModal";
import AmenityModal from "../../components/contents/AmenityModal";
import { tripAtom } from "../../atoms/tripAtom";
import jwtAxios from "../../apis/jwt";
import { getCookie } from "../../utils/cookie";

dayjs.extend(isBetween);
// 카테고리 한글 변환
export const categoryKor = category => {
  if (category === "STAY") return "호텔";
  if (category === "RESTAUR") return "식당";
  if (category === "TOUR") return "관광지";
  if (category === "FEST") return "축제";
  if (category === null) return "카테고리";
};
const ContentIndex = () => {
  // 쿼리 스트링 조회
  const [searchParams] = useSearchParams();
  const strfType = searchParams.get("strf");
  const strfId = searchParams.get("strfId");
  // recoil
  const [userInfo, setUserInfo] = useRecoilState(userAtom);

  const accessToken = getCookie("accessToken");
  // console.log("토큰", accessToken);
  const { nowTripId } = useRecoilValue(tripAtom);
  // console.log("현재 tripId:", nowTripId);
  // useNavigate
  const navigate = useNavigate();
  const navigatePostReview = () => {
    navigate(`/contents/postreview?strfId=${strfId}`, { state: contentData });
  };
  //useState
  const [contentData, setContentData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(true);
  const [isRegistModalOpen, setIsRegistModalOpen] = useState(false);
  const [openBusinessTime, setOpenBusinessTime] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewsData, setReviewsData] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(6);
  // useRef
  const imgRef = useRef(null);
  useEffect(() => {
    console.log(imgRef.current);
  }, []);
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
  // 일정 등록 모달
  const showRegistModal = () => {
    if (nowTripId === 0) {
      setIsRegistModalOpen(true);
    } else {
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
  const getDetailGuest = async () => {
    const sendData = {
      strfId: strfId,
    };
    console.log("sendData:", sendData);
    try {
      const res = await axios.get(
        `/api/detail/member/non?strf_id=${strfId}`,
        sendData,
      );
      const resultData = res.data.data;
      console.log("resultData", resultData);
      setContentData(resultData);
    } catch (error) {
      console.log("상품조회", error);
    }
  };
  // 상품조회(회원)
  const getDetailMember = async () => {
    const sendData = {
      strfId: strfId,
      userId: userInfo.userId,
    };
    console.log("sendData:", sendData);
    try {
      const res = await jwtAxios.get(
        `/api/detail/member?user_id=${userInfo.userId}&strf_id=${strfId}`,
        sendData,
      );
      const resultData = res.data.data;
      console.log("resultData", resultData);
      setContentData(resultData);
    } catch (error) {
      console.log("상품조회", error);
    }
  };
  //리뷰 조회
  const getReview = useCallback(async () => {
    const sendData = {
      page: 1,
      size: 6,
      strfId: strfId,
    };
    console.log("리뷰 불러오기 리퀘스트:", sendData);
    try {
      const res = await axios.get(
        `/api/review?page=1&size=6&strfId=${strfId}`,
        sendData,
      );
      console.log("리뷰 더 불러오기:", res.data);
      setReviewsData(res.data.data);
      setReviewIndex(prev => prev + 10);
    } catch (error) {
      console.log("리뷰 더 불러오기:", error);
    }
  }, []);
  useEffect(() => {
    if (accessToken) {
      getDetailMember();
    } else {
      getDetailGuest();
    }
    getReview();
  }, []);

  //

  // 편의시설 아이콘
  const amenities = [
    { key: "침대", icon: <FaBed /> },
    { key: "산", icon: <AiOutlineFundView /> },
    { key: "와이파이", icon: <BiWifi /> },
    { key: "조리도구", icon: <PiForkKnifeBold /> },
    { key: "티비", icon: <PiMonitorBold /> },
    { key: "욕실", icon: <FaBath /> },
    { key: "냉난방", icon: <BsThermometerHalf /> },
    { key: "세안도구", icon: <PiHandSoapBold /> },
    { key: "세탁시설", icon: <PiWashingMachineBold /> },
    { key: "냉장고", icon: <CgSmartHomeRefrigerator /> },
    { key: "침구", icon: <BiBlanket /> },
    { key: "가스레인지", icon: <PiCookingPot /> },
    { key: "수영장", icon: <FaSwimmingPool /> },
    { key: "화재 경보기", icon: <FaFireExtinguisher /> },
    { key: "금고", icon: <AiOutlineSafety /> },
  ];
  // 검색 지우기
  const onChange = key => {
    console.log(key);
  };

  return (
    <div className="relative pb-[70px]">
      {/* 헤더 */}
      <ContentsHeader contentData={contentData} strfId={strfId} />
      {/* 메인 썸네일 */}
      <div className="w-full h-[467px] bg-gray-200">
        <img
          src={`http://112.222.157.156:5221/strf/${strfId}/${contentData?.strfPics[0].pic}`}
          alt="content-thumbnail"
          className="w-full h-full object-cover"
          ref={imgRef}
        />
      </div>
      {/* 컨텐츠 영역 */}
      <div className="w-full flex flex-col gap-[30px] px-[32px] py-[30px]">
        {/* 카테고리, 업체명, 주소, 별점, 찜하기, 영업시간 */}
        <div className="w-full flex flex-col gap-[10px]">
          {/* 카테고리 */}
          <div className="text-[16px] text-slate-500">
            {categoryKor(contentData?.category || "STAY")}
          </div>
          {/* 컨텐츠 타이틀 */}
          <div className="font-semibold text-[36px] text-slate-700 line">
            {contentData?.strfTitle || "제목"}
          </div>
          {/* 주소 */}
          <div className="flex gap-[5px] items-center">
            <FaLocationDot className="text-[18px] text-slate-300" />
            <p className="text-[16px] text-slate-700">
              {contentData?.locationName || "주소"}
            </p>
          </div>
          {/* 별점 및 찜하기*/}
          <div className="flex gap-[20px] items-center">
            {/* 별점 */}
            <div className="flex gap-[5px] items-center">
              <Rate disabled count={1} value={1} />
              <p className="text-[16px] text-slate-700 font-semibold">
                {contentData?.ratingAvg || "5.0"}
              </p>
              <p className="text-[16px] text-primary underline">
                {/* 리뷰 {(reviewsData ? reviewsData.length : 0).toLocaleString()}개 */}
              </p>
            </div>
            <p className="text-[16px] text-slate-300 font-light">|</p>
            {/* 찜하기 */}
            <div className="flex gap-[5px] items-center">
              {contentData?.wishIn ? (
                <AiFillHeart className="text-color-secondary3" />
              ) : (
                <AiOutlineHeart className="text-slate-400" />
              )}

              <p className="text-[16px] text-slate-700">
                {(contentData?.wishCnt || 1000).toLocaleString()}
              </p>
            </div>
          </div>
          {/* 영업 시간 */}
          <BusinessTime
            type={strfType}
            contentData={contentData}
            openBusinessTime={openBusinessTime}
            setOpenBusinessTime={setOpenBusinessTime}
          />
        </div>
        {/* 쿠폰 */}
        {strfType === "STAY" && (
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
            {/* 라인 */}
            <div className="w-full h-[10px] bg-slate-100"></div>
          </div>
        )}
        {/* 메뉴 */}
        <Menu type={strfType} strfId={strfId} contentData={contentData} />
        {/* 편의 시설 및 서비스 */}
        {strfType === "STAY" && (
          <div className="flex flex-col gap-[30px]">
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
              <ul className="flex flex-wrap gap-auto vertical-gap-[20px]">
                {contentData ? (
                  contentData.amenities.map((item, index) => {
                    return (
                      <li
                        className="flex flex-col gap-[10px] items-center"
                        key={index}
                      >
                        <div className="text-[24px] w-[24px] h-[24px]">
                          {amenities.find(amenity => amenity.key === item).icon}
                        </div>
                        <p className="text-slate-700">{item}</p>
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
        <div className="w-full flex items-center justify-center">
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
            reviewsData={reviewsData}
            setReviewsData={setReviewsData}
            reviewIndex={reviewIndex}
            setReviewIndex={setReviewIndex}
          />
        )}
      </div>
      {/* 일정 추가 및 리뷰쓰기 버튼 */}
      {accessToken ? (
        <div className="px-[32px] py-[20px] flex max-w-3xl w-full mx-auto items-center gap-10 bg-white fixed bottom-0 left-[50%] translate-x-[-50%] z-30">
          <button
            type="button"
            className="w-full flex gap-[10px] py-[10px] border border-slate-300 rounded-lg items-center justify-center"
            onClick={showRegistModal}
          >
            <FaLocationDot className="text-slate-400" />
            <p className="text-[22px] text-slate-700 font-medium">일정 추가</p>
          </button>
          <button
            type="button"
            className="w-full flex gap-[10px] py-[10px] border border-slate-300 rounded-lg items-center justify-center"
            onClick={() => {
              showReviewModal();
            }}
          >
            <BiSolidEditAlt className="text-slate-400" />
            <p className="text-[22px] text-slate-700 font-medium">리뷰 쓰기</p>
          </button>
        </div>
      ) : null}

      {/* 일정 추가 모달창 */}
      {isRegistModalOpen ? (
        <ScheduleModal handleRegistCancel={handleRegistCancel} />
      ) : null}
      {/* 편의 시설 모달창 */}
      {isModalOpen ? (
        <AmenityModal handleCancel={handleCancel} amenities={amenities} />
      ) : null}
    </div>
  );
};
export default ContentIndex;
