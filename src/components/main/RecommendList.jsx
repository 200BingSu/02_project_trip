import React from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductPic } from "../../constants/pic";

const RecommendList = ({ recommend }) => {
  const navigate = useNavigate();
  if (!recommend || recommend.length === 0) {
    return null;
  }

  return (
    <div>
      <h1 className="px-4 text-2xl font-bold text-slate-700">
        회원님에게 추천하는 여행지
      </h1>
      <Swiper slidesPerView={2.3} className="mySwiper mt-5">
        {recommend.map(item => (
          <SwiperSlide
            key={item.strfId}
            className="align-middle justify-center  px-3 cursor-pointer"
            onClick={() => navigate(`/contents/index?strfId=${item.strfId}`)}
          >
            <img
              src={`${ProductPic}/${item.strfId}/${item.strfPic}`}
              alt={item.strfTitle}
              className="w-full aspect-[6/4] rounded-tr-[36px] rounded-bl-[36px]"
            />
            <div className=" gap-[6px] mt-3 ml-3 w-full">
              <span className="bg-slate-800 text-white py-1 px-2 rounded-2xl font-light text-xs inline">
                {item.locationTitle}
              </span>
              <h2 className="text-xl font-semibold break-keep mt-1">
                {item.strfTitle}
              </h2>
              {/* <p>{item.category}</p> */}
              <p className="text-lg font-light text-slate-600 break-keep mt-1">
                {item.explain}
              </p>
              <Link
                to=""
                className="py-2 text-sm text-slate-400 flex items-center font-light"
              >
                자세히보기 <IoIosArrowRoundForward className="text-lg" />
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RecommendList;
