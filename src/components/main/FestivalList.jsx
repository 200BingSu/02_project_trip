import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductPic } from "../../constants/pic";
import { useNavigate } from "react-router-dom";

const FestivalList = ({ festivities }) => {
  const navigate = useNavigate();
  return (
    <div>
      <Swiper slidesPerView={1.3} spaceBetween={12} className="mySwiper">
        {festivities.map(item => (
          <SwiperSlide
            key={item.strfId}
            className="aspect-[3/4] cursor-pointer relative text-white rounded-tl-[60px] rounded-br-[60px] overflow-hidden after:absolute after:left-0 after:bottom-0 after:w-full after:h-[50%] after:bg-gradient-to-b after:from-transparent after:to-black after:opacity-70"
            onClick={() => navigate(`/contents/index?strfId=${item.strfId}`)}
          >
            <img
              src={`${ProductPic}/${item.strfId}/${item.strfPic}`}
              alt={item.festTitle}
              className="w-full h-full object-cover"
            />

            <div className="absolute bottom-10 right-8 text-right z-[99] pl-8">
              {item.open && (
                <span className="text-xs inline-block bg-secondary3 px-2 py-1 font-light ">
                  개최중
                </span>
              )}
              <h2
                className="text-xl font-semibold"
                style={{ wordBreak: "auto-phrase" }}
              >
                {item.festTitle}
              </h2>
              <h4 className="text-sm font-medium ">
                {item.startAt.replaceAll("-", ".")}~
                {item.endAt.replaceAll("-", ".")}
              </h4>
              <p className="text-sm font-normal">{item.locationTitle}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FestivalList;
