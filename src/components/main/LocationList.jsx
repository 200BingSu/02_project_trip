import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { LocationPic } from "../../constants/pic";

const LocationList = ({ locations }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-700">
        국내 여행지 <b className="text-secondary3 font-bold">BEST 10</b>
      </h1>
      <Swiper slidesPerView={3} spaceBetween={12} className="mySwiper ">
        {locations.map((item, index) => (
          <SwiperSlide key={item.locationId} className="relative pt-5">
            <div className="relative bg-black rounded-lg overflow-hidden ">
              <img
                src={`${LocationPic}/${item.locationPic}`}
                alt={item.locationTitle}
                className="opacity-70 w-full aspect-square object-cover"
              />
              <p className="absolute z-[999] bg-secondary3 text-white w-6 h-6 leading-6 left-0 top-0 text-center inline-block text-xs rounded-br-lg">
                {index + 1}
              </p>
              <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-center text-white ">
                <p className="text-xs">대한민국</p>
                <h3 className="font-semibold text-lg mt-1">
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
