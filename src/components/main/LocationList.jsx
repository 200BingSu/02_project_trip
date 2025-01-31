import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

const LocationList = ({ locations }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold">
        국내 여행지 <b className="text-secondary3 font-bold">BEST 10</b>
      </h1>
      <Swiper slidesPerView={4} spaceBetween={16} className="mySwiper ">
        {locations.map((item, index) => (
          <SwiperSlide key={item.locationId} className="relative pt-[40px]">
            <p className="absolute z-[999] bg-secondary3 text-white w-[36px] h-[36px] leading-[36px] rounded-full left-1/2 top-[24px] -translate-x-1/2 text-center inline-block text-lg">
              {index + 1}
            </p>
            <div className="relative bg-black rounded-2xl overflow-hidden h-[226px]">
              <img
                src={item.locationPic}
                alt={item.locationTitle}
                className="opacity-70"
              />

              <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-center text-white text-base">
                <p>대한민국</p>
                <h3 className="font-semibold text-2xl mt-1">
                  {item.locationTitle}
                </h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default LocationList;
