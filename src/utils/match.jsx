import { AiTwotoneHeart } from "react-icons/ai";
import { BiNavigation, BiSolidBus, BiSolidTrain } from "react-icons/bi";
import { BsQuestionLg } from "react-icons/bs";
import { FaWalking } from "react-icons/fa";
import { FaLocationDot, FaTrainSubway } from "react-icons/fa6";
import { IoAirplane, IoReaderOutline } from "react-icons/io5";
import { MdOutlineAutoAwesomeMotion } from "react-icons/md";

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
// day 배경색
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
// day 선 색깔
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
    case "버스+열차": //버스+열차
      return <BiSolidBus />;
    case "지하철+열차": //지하철+열차
      return <BiSolidTrain />;
    case "항공": //항공
      return <IoAirplane />;
    default:
      return <BiNavigation />;
  }
};
// 날씨 아이콘
export const matchWeatherIcon = weather => {
  switch (weather) {
    case "sunny":
      return <img src="/images/weathericon/sunny.svg" alt="sunny" />;
    case "cloudy":
      return <img src="/images/weathericon/cloudy.svg" alt="cloudy" />;
    case "overcast":
      return <img src="/images/weathericon/overcast.svg" alt="overcast" />;
    case "rain":
      return <img src="/images/weathericon/rain.svg" alt="rain" />;
    case "snow":
      return <img src="/images/weathericon/snow.svg" alt="snow" />;
    default:
      return "";
  }
};

// 카테고리 한글 변환
export const categoryKor = category => {
  if (category === "STAY") return "숙소";
  if (category === "RESTAUR") return "식당";
  if (category === "TOUR") return "관광지";
  if (category === "FEST") return "축제";
  if (category === null) return "카테고리";
};
