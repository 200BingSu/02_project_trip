import { useSearchParams } from "react-router-dom";
import { CONTENT } from "../../constants/api";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBath,
  FaBed,
  FaFireExtinguisher,
  FaLocationDot,
} from "react-icons/fa6";
import { Modal, Rate, Skeleton, Tabs } from "antd";
import {
  AiOutlineFundView,
  AiOutlineSafety,
  AiTwotoneHeart,
} from "react-icons/ai";
import { BiBlanket, BiTime, BiWifi } from "react-icons/bi";
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

dayjs.extend(isBetween);

const ContentPublishing = () => {
  // 쿼리 스트링 조회
  const [searchParams] = useSearchParams();
  const strfType = searchParams.get("strf");
  const strfId = searchParams.get("strfId");
  //useState
  const [contentData, setContentData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(true);
  // 모달
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  //   영업시간 펼치기
  const [openBusinessTime, setOpenBusinessTime] = useState(false);

  // 상품 조회
  const getDetail = async () => {
    try {
      const res = await axios.get(`${CONTENT.getDetail}${strfId}`);
      const resultData = res.data.data;
      console.log("resultData", resultData);
      setContentData(resultData);
    } catch (error) {
      console.log("상품조회", error);
    }
  };
  useEffect(() => {
    getDetail();
  }, []);

  // 카테고리 한글 변환
  const categoryKor = category => {
    if (category === "STAY") return "호텔";
    if (category === "RESTAUR") return "식당";
    if (category === "TOUR") return "관광지";
    if (category === "FEST") return "축제";
    if (category === null) return "카테고리";
  };
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
    { key: "화재 경보기", icon: <FaFireExtinguisher /> },
    { key: "금고", icon: <AiOutlineSafety /> },
  ];

  const onChange = key => {
    console.log(key);
  };

  return (
    <div>
      {/* 헤더 */}
      <div>
        헤더(임시): contents?strf={strfType}&strfId={strfId}
      </div>
      {/* 메인 썸네일 */}
      <div className="w-full h-[467px] bg-gray-200">
        <img
          src={contentData?.thumbnail}
          alt="content-thumbnail"
          className="w-full h-full object-cover"
        />
      </div>
      {/* 컨텐츠 영역 */}
      <div className="w-full flex flex-col gap-[30px] px-[32px] py-[30px]">
        {/* 컨텐츠 영역 상단 */}
        <div className="w-full flex flex-col gap-[10px]">
          {/* 카테고리 */}
          <div className="text-[16px] text-slate-500">카테고리</div>
          {/* 컨텐츠 타이틀 */}
          <div className="font-semibold text-[36px] text-slate-700 line">
            제목
          </div>
          {/* 주소 */}
          <div className="flex gap-[5px] items-center">
            <FaLocationDot className="text-[18px] text-slate-300" />
            <p className="text-[16px] text-slate-700">주소</p>
          </div>
          {/* 별점 및 찜하기*/}
          <div className="flex gap-[20px] items-center">
            {/* 별점 */}
            <div className="flex gap-[5px] items-center">
              <Rate disabled count={1} value={1} />
              <p className="text-[16px] text-slate-700 font-semibold">
                {contentData?.ratingAvg || "평점"}
              </p>
              <p className="text-[16px] text-primary underline">
                리뷰 {(contentData?.ratingCnt || 1000).toLocaleString()}개
              </p>
            </div>
            <p className="text-[16px] text-slate-300 font-light">|</p>
            {/* 찜하기 */}
            <div className="flex gap-[5px] items-center">
              <AiTwotoneHeart className="text-[18px] text-slate-100" />
              <p className="text-[16px] text-slate-700">
                {(contentData?.wishCnt || 1000).toLocaleString()}
              </p>
            </div>
          </div>
          {/* 영업 시간 */}
          <BusinessTime type={strfType} />
        </div>
        {/* 쿠폰 */}
        {strfType === "STAY" && (
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
        )}
        {/* 라인 */}
        <div className="w-full h-[10px] bg-slate-100"></div>
        {/* 메뉴 */}
        <Menu type={strfType} />
        {/* 라인 */}
        <div className="w-full h-[10px] bg-slate-100"></div>
        {/* 편의 시설 및 서비스 */}
        {strfType === "STAY" && (
          <div className="flex flex-col gap-[20px]">
            <div className="flex gap-[5px] items-center justify-between">
              <h2 className="text-[28px] font-semibold">편의 시설 및 서비스</h2>
              <button
                type="button"
                className="flex gap-[10px] items-center text text-slate-400"
                onClick={showModal}
              >
                더보기 <IoIosArrowRoundForward />
              </button>
              <Modal
                closeIcon={null}
                title={null}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
                width={768}
                styles={{
                  content: { padding: "20px 0" },
                }}
              >
                <div className="custom-modal-header flex gap-[40px] px-[32px] items-center mb-[20px]">
                  <div className="custom-close-icon" onClick={handleCancel}>
                    <IoIosClose className="text-[35px]" />
                  </div>
                  <div className="custom-title font-bold text-[24px] text-slate-700">
                    편의시설 및 서비스
                  </div>
                </div>
                <ul className="flex flex-wrap gap-[30px] vertical-gap-[20px]">
                  {amenities.map(item => (
                    <li
                      key={item.key}
                      className="flex flex-col gap-[10px] items-center w-[100px]"
                    >
                      <div>{item.icon}</div>
                      <p>{item.key}</p>
                    </li>
                  ))}
                </ul>
              </Modal>
            </div>
            {/* 편의시설 리스트 */}
            <ul className="flex flex-wrap gap-auto vertical-gap-[20px]">
              {contentData ? (
                contentData?.amenity.map((item, index) => {
                  return (
                    <li
                      className="flex flex-col gap-[10px] items-center"
                      key={index}
                    >
                      <div>
                        {amenities.find(amenity => amenity.key === item).icon}
                      </div>
                      <p>{item}</p>
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
        )}
        {/* 라인 */}
        <div className="w-full h-[10px] bg-slate-100"></div>
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
        {!isDetailOpen && <Reviews contentData={contentData} />}
      </div>
    </div>
  );
};
export default ContentPublishing;
