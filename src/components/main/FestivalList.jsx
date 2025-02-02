import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

const FestivalList = ({ festivities }) => {
  return (
    <div>
      <Swiper slidesPerView={1.5} spaceBetween={16} className="mySwiper">
        {festivities.map(item => (
          <SwiperSlide
            key={item.strfId}
            className="h-[600px] relative text-white rounded-tl-[60px] rounded-br-[60px] overflow-hidden after:absolute after:left-0 after:bottom-0 after:w-full after:h-[50%] after:bg-gradient-to-b after:from-transparent after:to-black after:opacity-70"
          >
            <img
              src={item.strfPic}
              alt={item.festTitle}
              className="h-[600px]"
            />

            <div className="absolute bottom-[60px] right-[30px] text-right z-[99]">
              {item.open && (
                <span className="text-xs inline-block bg-secondary3 px-2.5 py-1 rounded-md font-light mb-1.5">
                  개최중
                </span>
              )}
              <h2
                className="text-3xl font-medium mb-1.5"
                style={{ wordBreak: "auto-phrase" }}
              >
                {item.festTitle}
              </h2>
              <h4 className="text-2xl font-medium mb-1.5">
                {item.startAt.replaceAll("-", ".")}~
                {item.endAt.replaceAll("-", ".")}
              </h4>
              <p className="text-base font-">{item.locationTitle}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FestivalList;
