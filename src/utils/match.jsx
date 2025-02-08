import { AiTwotoneHeart } from "react-icons/ai";
import { BiNavigation, BiSolidBus, BiSolidTrain } from "react-icons/bi";
import { BsQuestionLg } from "react-icons/bs";
import { FaWalking } from "react-icons/fa";
import { FaLocationDot, FaTrainSubway } from "react-icons/fa6";
import { IoReaderOutline } from "react-icons/io5";
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
    case 1: //지하철
      return <FaTrainSubway />;
    case 2: //버스
      return <BiSolidBus />;
    case 3: //버스+지하철
      return <BiSolidBus />;
    case 11: //열차
      return <BiSolidTrain />;
    case 12:
      return <BiSolidBus />;
    case 20:
      return <BiSolidTrain />;
    case 13: //항공
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
