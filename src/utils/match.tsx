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
import { RiHotelLine } from "react-icons/ri";
import { amenities } from "../constants/dataArr";
import { CategoryType } from "../types/enum";
import { Button } from "antd";

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
export const categoryKor = (category: string | null | undefined) => {
  if (category === "STAY") return "숙소";
  if (category === "RESTAUR") return "맛집";
  if (category === "TOUR") return "관광지";
  if (category === "FEST") return "축제";
  if (category === null) return "카테고리";
};

// 한글 카테고리 => Enum
export const categoryToEnum = (category: string) => {
  if (category === "숙소") return CategoryType.STAY;
  if (category === "맛집") return CategoryType.RESTAURANT;
  if (category === "관광지") return CategoryType.TOUR;
  if (category === "축제") return CategoryType.FEST;
};

// 편의시설 아이콘 매칭
export const matchAmenitiesIcon = (amenityId: number) => {
  const amenity = amenities.find(item => item.amenity_id === amenityId) ?? null;
  return amenity?.icon;
};

export const matchName = (category: string | null) => {
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

export const matchRestDataToKor = (number: number | string) => {
  switch (number) {
    case 0:
      return "일";
    case 1:
      return "월";
    case 2:
      return "화";
    case 3:
      return "수";
    case 4:
      return "목";
    case 5:
      return "금";
    case 6:
      return "토";
    default:
      return "없음";
  }
};
export const matchRestDateEnToKo = (string: string) => {
  switch (string) {
    case "sun":
      return "일";
    case "mon":
      return "월";
    case "tue":
      return "화";
    case "wed":
      return "수";
    case "thu":
      return "목";
    case "fri":
      return "금";
    case "sat":
      return "토";
  }
};

export const transperRestValue = (value: string[]) => {
  return value.map(item => {
    switch (item) {
      case "일":
        return 0;
      case "월":
        return 1;
      case "화":
        return 2;
      case "수":
        return 3;
      case "목":
        return 4;
      case "금":
        return 5;
      case "토":
        return 6;
      default:
        return 0;
    }
  });
};

export const matchState = (state: number) => {
  switch (state) {
    case 0:
      return "영업중";
    case 1:
      return "휴업";
    case 2:
      return "폐업";
    default:
      return "알 수 없음";
  }
};

export const matchAmenityIcon = (amenityId: number) => {
  const finedamenity = amenities.find(item => item.amenity_id === amenityId);
  return finedamenity?.key;
};

export const matchBusiBookingButton = (state: string) => {
  switch (state) {
    case "0":
    case "1":
      return (
        <>
          <Button
            color="primary"
            variant="filled"
            className="w-full h-auto py-3 rounded-lg text-base font-semibold text-primary3 "
          >
            예약 취소
          </Button>
          <Button
            type="primary"
            className="w-full h-auto py-3 rounded-lg text-base font-semibold "
          >
            예약 승인
          </Button>
        </>
      );
    case "2":
      return (
        <>
          <Button className="w-full h-auto py-3 rounded-lg text-base font-semibold bg-primary2 text-slate-700">
            예약 취소
          </Button>
        </>
      );
    case "3":
      return (
        <>
          <Button
            className="w-full h-auto py-3 rounded-lg text-base font-semibold text-slate-700"
            disabled
          >
            예약 취소 완료
          </Button>
        </>
      );
  }
};
