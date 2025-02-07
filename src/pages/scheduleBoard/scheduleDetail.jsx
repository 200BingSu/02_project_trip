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
import { Swiper } from "swiper/react";
import axios from "axios";
import { getCookie } from "../../utils/cookie";
import { useEffect, useState } from "react";

//dummyData
const dummyData = [
  {
    day: 1,
    weather: "cloudy",
    schedules: [
      {
        seq: 1,
        strfId: 9,
        strfTitle: "청계천",
        category: "산책",
        address: "서울 종로구",
        lat: 37.570083,
        lng: 126.99022,
        distance: 2000,
        duration: 30,
        pathType: "도보",
      },
      {
        seq: 2,
        strfId: 10,
        strfTitle: "이태원 거리",
        category: "쇼핑",
        address: "서울 용산구",
        lat: 37.534246,
        lng: 126.999658,
        distance: 3500,
        duration: 40,
        pathType: "버스",
      },
      {
        seq: 3,
        strfId: 11,
        strfTitle: "롯데월드타워",
        category: "관광",
        address: "서울 송파구",
        lat: 37.513344,
        lng: 127.102213,
        distance: 8000,
        duration: 70,
        pathType: "지하철",
      },
      {
        seq: 4,
        strfId: 12,
        strfTitle: "서울숲",
        category: "산책",
        address: "서울 성동구",
        lat: 37.544481,
        lng: 127.046803,
        distance: 5000,
        duration: 60,
        pathType: "지하철",
      },
    ],
  },
  {
    day: 2,
    weather: "sunny",
    schedules: [
      {
        seq: 1,
        strfId: 2,
        strfTitle: "서울 타워",
        category: "관광",
        address: "서울 용산구",
        lat: 37.551229,
        lng: 126.988205,
        distance: 3000,
        duration: 50,
        pathType: "지하철",
      },
      {
        seq: 2,
        strfId: 3,
        strfTitle: "홍대 거리",
        category: "쇼핑",
        address: "서울 마포구",
        lat: 37.557242,
        lng: 126.924647,
        distance: 2500,
        duration: 40,
        pathType: "버스",
      },
    ],
  },
  {
    day: 3,
    weather: "rain",
    schedules: [
      {
        seq: 1,
        strfId: 4,
        strfTitle: "경복궁",
        category: "관광",
        address: "서울 종로구",
        lat: 37.577602,
        lng: 126.976944,
        distance: 2000,
        duration: 60,
        pathType: "지하철",
      },
      {
        seq: 2,
        strfId: 5,
        strfTitle: "북촌 한옥마을",
        category: "문화",
        address: "서울 종로구",
        lat: 37.579616,
        lng: 126.985017,
        distance: 1000,
        duration: 30,
        pathType: "도보",
      },
    ],
  },
  {
    day: 4,
    weather: "snow",
    schedules: [
      {
        seq: 1,
        strfId: 6,
        strfTitle: "남산 서울타워",
        category: "관광",
        address: "서울 용산구",
        lat: 37.551157,
        lng: 126.988197,
        distance: 4000,
        duration: 45,
        pathType: "버스",
      },
      {
        seq: 2,
        strfId: 7,
        strfTitle: "명동",
        category: "쇼핑",
        address: "서울 중구",
        lat: 37.56362,
        lng: 126.985002,
        distance: 500,
        duration: 20,
        pathType: "도보",
      },
    ],
  },
  {
    day: 5,
    weather: "partly cloudy",
    schedules: [
      {
        seq: 1,
        strfId: 8,
        strfTitle: "서울역사박물관",
        category: "문화",
        address: "서울 중구",
        lat: 37.551244,
        lng: 126.972204,
        distance: 1500,
        duration: 60,
        pathType: "도보",
      },
      {
        seq: 2,
        strfId: 9,
        strfTitle: "청계천",
        category: "산책",
        address: "서울 종로구",
        lat: 37.570083,
        lng: 126.99022,
        distance: 2000,
        duration: 30,
        pathType: "도보",
      },
    ],
  },
];

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
  useEffect(() => {
    console.log("tripReviewData", tripReviewData);
  }, [tripReviewData]);
  //다른 사용자의 여행기 조회
  const getOtherTripReview = async () => {
    try {
      const res = await axios.get(
        `/api/trip-review/otherTripReview?tripReviewId=${TripReviewId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      // console.log("다른 사람 여행기 조회", res.data);
      const resultData = res.data;
      setTripReviewData(resultData.data);
    } catch (error) {
      console.log("다른 사람 여행기 조회", error);
    }
  };
  useEffect(() => {
    getOtherTripReview();
  }, []);
  return (
    <div>
      <TitleHeader
        icon="back"
        onClick={handleNavigateBack}
        rightContent={<RightContent icon1={true} icon4={true} />}
      />
      <div className="flex flex-col px-[32px] py-[30px] gap-[30px] mt-[60px]">
        {/* 이미지 */}
        <Swiper slidesPerView={1} spaceBetween={16} className="mySwiper">
          {}
        </Swiper>
        <div className="h-[406px] bg-slate-200">
          <img src="#" alt="thum" className="w-full h-full object-cover" />
        </div>
        {/* info */}
        <div className="flex flex-col gap-[10px]">
          <p className="text-[18px] text-slate-700">작성일자</p>
          <div>
            <h2 className="font-bold text-[36px] text-slate-700">제목</h2>
            <ul className="flex gap-[10px] items-center">
              <li className="flex gap-[5px] items-center">
                <BiShow className="text-slate-300 text-[18px]" />
                <p className="text-slate-500 font-bold text-[14px]">조회수</p>
              </li>
              <li className="flex gap-[5px] items-center">
                <GoThumbsup className="text-slate-300 text-[18px]" />
                <p className="text-slate-500 font-bold text-[14px]">좋아요</p>
              </li>
              <li className="flex gap-[5px] items-center">
                <IoReaderOutline className="text-slate-300 text-[18px]" />
                <p className="text-slate-500 font-bold text-[14px]">작성수</p>
              </li>
            </ul>
          </div>
        </div>
        {/* 소개 */}
        <div>
          <p>
            창의성을 높이는 일상 속 습관은 아이디어 발상 기법과 창의적 사고
            훈련을 포함합니다. 아이디어 발상 기법으로는 브레인스토밍, 마인드맵,
            SCAMPER 등이 있으며, 이는 새로운 아이디어를 창출하는 데 도움을
            줍니다. 창의적 사고 훈련은 기존의 사고 방식을 벗어나 다양한 관점에서
            문제를 바라보는 능력을 키웁니다. 일상 속에서 이러한 습관을
            지속적으로 실천하면 창의성을 자연스럽게 향상시킬 수 있습니다.
          </p>
        </div>
        {/* 일정 */}
        <div className="flex flex-col gap-[50px]">
          {dummyData.map((item, index) => {
            return <ScheduleDay data={dummyData[index]} key={index} />;
          })}
        </div>
        {/* 버튼 */}
        <Button type="primary" className="flex gap-[10px] py-[10px] h-auto">
          <AiOutlineImport className="w-[30px] h-[30px] text-white" />
          <span className="font-semibold text-[24px] text-white">
            내 일정에 담기
          </span>
        </Button>
      </div>
    </div>
  );
};
export default ScheduleDetail;
