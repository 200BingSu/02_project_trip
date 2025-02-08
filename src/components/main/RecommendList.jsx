import React from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductPic } from "../../constants/pic";

const RecommendList = ({ recommend }) => {
  if (!recommend || recommend.length === 0) {
    return null;
  }
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-3xl font-bold mx-[32px]">
        회원님에게 추천하는 여행지
      </h1>
      <Swiper
        slidesPerView={1}
        className="mySwiper relative mt-5 after:bg-slate-100 after:inline-block after:w-full after:h-72 after:absolute after:top-0 after:left-0 "
      >
        {recommend.map(item => (
          <SwiperSlide
            key={item.strfId}
            className="!flex align-middle justify-center gap-8 mt-12 px-8 cursor-pointer"
            onClick={() => navigate(`/contents/index?strfId=${item.strfId}`)}
          >
            <p></p>
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
              src={`${ProductPic}${item.strfId}/${item.strfPic}`}
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
