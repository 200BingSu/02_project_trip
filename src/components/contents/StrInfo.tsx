import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";


import { Swiper, SwiperSlide } from "swiper/react";
import { BiDownload, BiTime } from "react-icons/bi";

import { FaLocationDot } from "react-icons/fa6";
import { RxStarFilled } from "react-icons/rx";
import { ProductPic } from "../../constants/pic";
import { categoryKor, matchRestDataToKor } from "../../utils/match";
import { IStrf } from "../../types/interface";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";


export interface StrInfoProps {
  strfId: number;
  contentData: IStrf | null;
}


export interface couponProps {
  couponId: number;
  couponName: string;
  expiredAt: string;
  discountPer: number;
  distributeAt: string;
}

const StrInfo = ({ strfId, contentData }: StrInfoProps): JSX.Element => {
  const [coupon, setCoupon] = useState<couponProps[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>();

  const getCoupon = async () => {
    try {
      const res = await jwtAxios.get(`/api/detail/coupon?strf_id=${strfId}`);
      setCoupon(res.data);
      console.log("응답 전체:", res);
      console.log("쿠폰", res.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getCoupon();
  }, []);

  return (
    <div>
      <div>
        <Swiper loop={true} className="mySwiper flex">

          {contentData?.strfPics.map((item, index) => (
            <SwiperSlide key={index} className="aspect-[1/2] max-h-[500px]">
              <img
                src={`${ProductPic}/${strfId}/${item?.strfPics}`}
                alt={contentData?.strfTitle || ""}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="px-4 py-3 flex flex-col gap-2">
        <p className="text-sm text-slate-500 -mb-[6px]">
          {categoryKor(contentData?.category)}
        </p>
        <h2 className="text-2xl text-slate-700 font-semibold">
          {contentData?.strfTitle}
        </h2>
        <p className="text-sm text-slate-500 flex items-center gap-[6px]">
          <FaLocationDot className=" text-slate-300" />
          {contentData?.address}
        </p>
        <ul className="flex items-center gap-[6px]">
          <li>
            <RxStarFilled className="text-primary text-base" />
          </li>
          <li className="text-sm text-slate-700 font-semibold">
            {contentData?.ratingAvg}
          </li>
          <li className="text-sm text-primary underline">
            리뷰 {contentData?.reviewCnt.toLocaleString()}개
          </li>
          <li className="text-slate-300 text-base mx-1">|</li>
          <li className="text-lg text-slate-400">
            {contentData?.wishIn ? (
              <AiFillHeart className="text-secondary3" />
            ) : (
              <AiOutlineHeart />
            )}
          </li>
          <li className="text-slate-500 text-sm">{contentData?.wishCnt}</li>
        </ul>
        <div>
          <p className="flex items-center gap-[6px] text-slate-500">
            <BiTime className="text-sm" />
            {contentData?.restDate && contentData.restDate.length > 0
              ? contentData.restDate.map(
                  item => ` ${matchRestDataToKor(item)}요일 휴무 `,
                )
              : "매일"}
            {contentData?.openCheck.replace(/:\d{2}$/, "")} ~
            {contentData?.closeCheck.replace(/:\d{2}$/, "")}
          </p>
        </div>

        {contentData?.category === "STAY" && (
          <div className="w-full flex flex-col gap-[30px]">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full gap-3 flex items-center justify-between  rounded-lg px-4 py-3 border border-primary2 text-primary text-[16px] font-semibold"
            >
              쿠폰 받기
              <BiDownload className="text-xl" />
            </button>
          </div>
        )}
      </div>
      {isOpen && <CouponList coupon={coupon} setIsOpen={setIsOpen} />}

    </div>
  );
};

export default StrInfo;
