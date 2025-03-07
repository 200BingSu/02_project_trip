import { ReactNode } from "react";
import {
  BiNavigation,
  BiSolidBus,
  BiSolidFoodMenu,
  BiSolidTrain,
} from "react-icons/bi";
import { FaTrainSubway } from "react-icons/fa6";
import {
  IoAirplane,
  IoBalloon,
  IoKeyOutline,
  IoRestaurant,
  IoTicket,
} from "react-icons/io5";
import { MdBedroomChild } from "react-icons/md";
import { RiHotelLine } from "react-icons/ri";
import { amenities } from "../constants/dataArr";
import { CategoryType } from "../types/enum";

// day 색깔
export const dayTextColor = (dayNum: number): string => {
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
export const dayBgColor = (dayNum: number): string => {
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
export const dayLineColor = (dayNum: number): string => {
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
export const matchPathTypeIcon = (pathType: string): ReactNode => {
  switch (pathType) {
    case "지하철": //지하철
      return <FaTrainSubway />;
    case "버스": //버스
      return <BiSolidBus />;
    case "고속/시외버스": //버스
      return <BiSolidBus />;
    case "기차": // 기차
      return <BiSolidTrain />;
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
// pathType 숫자
export const matchPathTypeNumIcon = (pathType: number): ReactNode => {
  switch (pathType) {
    case 1: //지하철
      return <FaTrainSubway />;
    case 2: //버스
      return <BiSolidBus />;
    case 12: //고속/시외버스
      return <BiSolidBus />;
    case 4: // 기차
      return <BiSolidTrain />;
    case 3: //버스+지하철
      return <BiSolidBus />;
    case 11: //열차
      return <BiSolidTrain />;
    case 20: //버스+열차
      return <BiSolidBus />;
    case 21: //지하철+열차
      return <BiSolidTrain />;
    case 13: //항공
      return <IoAirplane />;
    default:
      return <BiNavigation />;
  }
};
// 날씨 아이콘
export const matchWeatherIcon = (weather: string) => {
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
export const categoryKor = (category: string | null) => {
  if (category === "STAY") return "숙소";
  if (category === "RESTAUR") return "식당";
  if (category === "TOUR") return "관광지";
  if (category === "FEST") return "축제";
  if (category === null) return "카테고리";
};

// 편의시설 아이콘 매칭
export const matchAmenitiesIcon = (amenityId: number) => {
  const amenity = amenities.find(item => item.amenity_id === amenityId) ?? null;
  return amenity?.icon;
};

export const matchName = (category: string) => {
  switch (category) {
    case CategoryType.STAY:
      return "객실";
    case CategoryType.RESTAURANT:
      return "메뉴";
    case CategoryType.FEST:
    case CategoryType.TOUR:
      return "입장권";
  }
};

export const matchcategoryIcon = (category: string): ReactNode => {
  switch (category) {
    case CategoryType.STAY:
      return <RiHotelLine />;
    case CategoryType.RESTAURANT:
      return <IoRestaurant />;
    case CategoryType.FEST:
      return <IoBalloon />;
    case CategoryType.TOUR:
      return <IoBalloon />;
  }
};

export const matchMenuIcon = (category: string): ReactNode => {
  switch (category) {
    case CategoryType.STAY:
      return <IoKeyOutline />;
    case CategoryType.RESTAURANT:
      return <BiSolidFoodMenu />;
    case CategoryType.FEST:
      return <IoTicket />;
    case CategoryType.TOUR:
      return <IoTicket />;
  }
};
