import React from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

const data = {
  recommendList: [
    {
      strfId: 193,
      strfTitle: "포레스트 리솜 해브나인 스파 (해브나인 힐링스파)",
      locationTitle: "충북 ",
      category: "TOUR",
      strfPic: "https://picsum.photos/500",
      explain: "생활에 지친 몸과 마음에 휴식을 주는 곳",
    },
    {
      strfId: 473,
      strfTitle: "포천아트밸리 (한탄강 유네스코 세계지질공원)",
      locationTitle: "경기도",
      category: "TOUR",
      strfPic: "https://picsum.photos/500",
      explain: "폐채석장의 변신, 반려동물 동반 가능한 복합문화공간",
    },
    {
      strfId: 571,
      strfTitle: "쉬자파크",
      locationTitle: "가평&양평 양평군",
      category: "TOUR",
      strfPic: "https://picsum.photos/500",
      explain: "상품 소개입니다.",
    },
    {
      strfId: 633,
      strfTitle: "두물머리",
      locationTitle: "가평&양평 양평군",
      category: "TOUR",
      strfPic: "https://picsum.photos/500",
      explain: "상품 소개입니다.",
    },
    {
      strfId: 328,
      strfTitle: "보문관광단지",
      locationTitle: "경주 경주시",
      category: "TOUR",
      strfPic: "https://picsum.photos/500",
      explain: "상품 소개입니다.",
    },
  ],
};

const RecommendList = ({ recommend }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold">회원님에게 추천하는 여행지</h1>
      <Swiper
        slidesPerView={1}
        className="mySwiper relative mt-5 after:bg-slate-100 after:inline-block after:w-full after:h-72 after:absolute after:top-0 after:left-0 "
      >
        {data.recommendList.map(item => (
          <SwiperSlide
            key={item.strfId}
            className="!flex align-middle justify-center gap-8 mt-12 px-8"
          >
            <div className="mt-12 w-[50%]">
              <span className="bg-slate-800 text-white py-1 px-3 rounded-2xl font-light text-xs">
                {item.locationTitle}
              </span>
              <h2 className="text-2xl font-medium break-keep">
                {item.strfTitle}
              </h2>
              {/* <p>{item.category}</p> */}
              <p className="text-lg font-normal text-slate-500 break-keep">
                {item.explain}
              </p>
              <Link
                to=""
                className="text-slate-400 flex align-middle font-light gap-1"
              >
                자세히보기 <IoIosArrowRoundForward className="text-lg" />
              </Link>
            </div>
            <img
              src={item.strfPic}
              alt={item.strfTitle}
              className="w-[400px] h-[300px] rounded-tr-[36px] rounded-bl-[36px]"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RecommendList;
