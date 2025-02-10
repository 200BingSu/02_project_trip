import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductPic } from "../../constants/pic";
import { useNavigate } from "react-router-dom";

const FestivalList = ({ festivities }) => {
  const navigate = useNavigate();
  return (
    <div>
      <Swiper slidesPerView={1.5} spaceBetween={16} className="mySwiper">
        {festivities.map(item => (
          <SwiperSlide
            key={item.strfId}
            className="!h-[600px] cursor-pointer relative text-white rounded-tl-[60px] rounded-br-[60px] overflow-hidden after:absolute after:left-0 after:bottom-0 after:w-full after:h-[50%] after:bg-gradient-to-b after:from-transparent after:to-black after:opacity-70"
            onClick={() => navigate(`/contents/index?strfId=${item.strfId}`)}
          >
            <img
              src={`${ProductPic}${item.strfId}/${item.strfPic}`}
              alt={item.festTitle}
              className="w-full h-full object-cover"
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
