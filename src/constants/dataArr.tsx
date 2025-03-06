import { AiOutlineSafety } from "react-icons/ai";
import { BiBlanket, BiWifi } from "react-icons/bi";
import { BsThermometerHalf } from "react-icons/bs";
import {
  FaBath,
  FaBed,
  FaFireExtinguisher,
  FaSwimmingPool,
} from "react-icons/fa";
import {
  FaComputer,
  FaHotTubPerson,
  FaHouseFloodWater,
  FaTrainSubway,
} from "react-icons/fa6";
import { GiPillow } from "react-icons/gi";
import { IoIosBed } from "react-icons/io";
import {
  PiCookingPot,
  PiForkKnifeBold,
  PiHandSoapBold,
  PiMonitorBold,
  PiWashingMachineBold,
} from "react-icons/pi";
import { Iamenity } from "../types/interface";

export const strfArr = ["STAY", "TOUR", "RESTAUR", "FEST"];
export const pathType = ["모두", "지하철", "버스", "버스+지하철"];

// 편의시설 아이콘

export const amenities: Iamenity[] = [
  { amenity_id: 1, key: "트윈베드", icon: <IoIosBed /> },
  { amenity_id: 2, key: "싱글베드", icon: <FaBed /> },
  { amenity_id: 3, key: "와이파이", icon: <BiWifi /> },
  { amenity_id: 4, key: "에어컨", icon: <BsThermometerHalf /> },
  { amenity_id: 5, key: "난방", icon: <BsThermometerHalf /> },
  { amenity_id: 6, key: "온수", icon: <BsThermometerHalf /> },
  { amenity_id: 7, key: "TV", icon: <PiMonitorBold /> },
  { amenity_id: 8, key: "컴퓨터", icon: <FaComputer /> },
  { amenity_id: 9, key: "화재경보기", icon: <FaFireExtinguisher /> },
  { amenity_id: 10, key: "세탁기", icon: <PiWashingMachineBold /> },
  { amenity_id: 11, key: "금고", icon: <AiOutlineSafety /> },
  { amenity_id: 12, key: "침구", icon: <BiBlanket /> },
  { amenity_id: 13, key: "세안도구", icon: <PiHandSoapBold /> },
  { amenity_id: 14, key: "욕조", icon: <FaBath /> },
  { amenity_id: 15, key: "조리도구", icon: <PiForkKnifeBold /> },
  { amenity_id: 16, key: "주방", icon: <PiCookingPot /> },
  { amenity_id: 17, key: "오션뷰", icon: <FaHouseFloodWater /> },
  { amenity_id: 18, key: "역세권", icon: <FaTrainSubway /> },
  { amenity_id: 19, key: "핫터프", icon: <FaHotTubPerson /> },
  { amenity_id: 20, key: "풀장", icon: <FaSwimmingPool /> },
  { amenity_id: 21, key: "주차장", icon: <GiPillow /> },
];
