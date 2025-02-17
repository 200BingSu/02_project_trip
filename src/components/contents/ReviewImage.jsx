import { useEffect, useRef, useState } from "react";
import { ReviewPic } from "../../constants/pic";
import { Swiper, SwiperSlide } from "swiper/react";

const ReviewImage = ({ imgArr, reviewId }) => {
  const imgArrLeng = imgArr?.length;

  const [showSwiper, setShowSwiper] = useState(false);
  const imgRef = useRef(null);
  // useEffect(() => {
  //   console.log(imgRef.current);
  // }, [imgRef]);

  const handleImageClick = () => {
    setShowSwiper(true);
  };

  // 스와이퍼 모달 닫기
  const handleCloseSwiper = () => {
    setShowSwiper(false);
  };

  return (
    <div>
      {imgArrLeng === 1 && (
        <ul className="h-[400px] rounded-lg overflow-hidden">
          <li className="w-full h-full bg-slate-200">
            <img
              src={`${ReviewPic}${reviewId}/${imgArr[0].pic}`}
              alt={`${reviewId}`}
              ref={imgRef}
              className="w-full h-full object-cover cursor-pointer"
              onClick={handleImageClick}
            />
          </li>
        </ul>
      )}
      {imgArrLeng === 2 && (
        <ul className="h-[400px] grid grid-cols-2 gap-[10px] rounded-lg overflow-hidden">
          <li className="w-full h-full bg-slate-200">
            <img
              src={`${ReviewPic}${reviewId}/${imgArr[0].pic}`}
              alt={`${imgArr[0].reviewId}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={handleImageClick}
            />
          </li>
          <li className="w-full h-full bg-slate-200">
            <img
              src={`${ReviewPic}${reviewId}/${imgArr[1].pic}`}
              alt={`${imgArr[1].reviewId}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={handleImageClick}
            />
          </li>
        </ul>
      )}
      {imgArrLeng === 3 && (
        <ul className="h-[400px] grid grid-cols-4 grid-rows-4 gap-[10px] rounded-lg overflow-hidden">
          <li className="bg-slate-200 col-span-2 row-span-4">
            <img
              className="w-full h-full object-cover cursor-pointer"
              src={`${ReviewPic}${reviewId}/${imgArr[0].pic}`}
              alt={`${imgArr[0].reviewId}`}
              onClick={handleImageClick}
            />
          </li>
          <li className="bg-slate-200 col-span-2 row-span-2 col-start-3 row-start-1">
            <img
              className="w-full h-full object-cover cursor-pointer"
              src={`${ReviewPic}${reviewId}/${imgArr[1].pic}`}
              alt={`${imgArr[1].reviewId}`}
              onClick={handleImageClick}
            />
          </li>
          <li className="bg-slate-200 col-span-2 row-span-2 col-start-3 row-start-3">
            <img
              className="w-full h-full object-cover cursor-pointer"
              src={`${ReviewPic}${reviewId}/${imgArr[2].pic}`}
              alt={`${imgArr[2].reviewId}`}
              onClick={handleImageClick}
            />
          </li>
        </ul>
      )}
      {imgArrLeng === 4 && (
        <ul className="h-[400px] grid grid-cols-4 grid-rows-4 gap-2.5 rounded-lg overflow-hidden">
          <li className="bg-slate-200 col-start-3 col-end-5 row-start-1 row-end-3">
            <img
              className="w-full h-full object-cover cursor-pointer"
              src={`${ReviewPic}${reviewId}/${imgArr[0].pic}`}
              alt={`${imgArr[0].reviewId}`}
              onClick={handleImageClick}
            />
          </li>
          <li className="bg-slate-200 col-start-3 col-end-5 row-start-3 row-end-5">
            <img
              className="w-full h-full object-cover cursor-pointer"
              src={`${ReviewPic}${reviewId}/${imgArr[1].pic}`}
              alt={`${imgArr[1].reviewId}`}
              onClick={handleImageClick}
            />
          </li>
          <li className="bg-slate-200 col-start-1 col-end-3 row-start-1 row-end-3">
            <img
              className="w-full h-full object-cover cursor-pointer"
              src={`${ReviewPic}${reviewId}/${imgArr[2].pic}`}
              alt={`${imgArr[2].reviewId}`}
              onClick={handleImageClick}
            />
          </li>
          <li className="bg-slate-200 col-start-1 col-end-3 row-start-3 row-end-5">
            <img
              className="w-full h-full object-cover cursor-pointer"
              src={`${ReviewPic}${reviewId}/${imgArr[3].pic}`}
              alt={`${imgArr[3].reviewId}`}
              onClick={handleImageClick}
            />
          </li>
        </ul>
      )}
      {imgArrLeng === 5 && (
        <ul className="h-[400px] grid grid-cols-4 grid-rows-4 gap-2.5 rounded-lg overflow-hidden">
          <li className="col-start-1 col-end-3 row-start-1 row-end-5 bg-slate-200">
            <img
              className="w-full h-full object-cover cursor-pointer"
              src={`${ReviewPic}${reviewId}/${imgArr[0].pic}`}
              alt={`${imgArr[0].reviewId}`}
              onClick={handleImageClick}
            />
          </li>
          <li className="col-start-3 col-end-4 row-start-1 row-end-3 bg-slate-200">
            <img
              className="w-full h-full object-cover cursor-pointer"
              src={`${ReviewPic}${reviewId}/${imgArr[1].pic}`}
              alt={`${imgArr[1].reviewId}`}
              onClick={handleImageClick}
            />
          </li>
          <li className="col-start-3 col-end-4 row-start-3 row-end-5 bg-slate-200">
            <img
              className="w-full h-full object-cover cursor-pointer"
              src={`${ReviewPic}${reviewId}/${imgArr[2].pic}`}
              alt={`${imgArr[2].reviewId}`}
              onClick={handleImageClick}
            />
          </li>
          <li className="col-start-4 col-end-5 row-start-1 row-end-3 bg-slate-200">
            <img
              className="w-full h-full object-cover cursor-pointer"
              src={`${ReviewPic}${reviewId}/${imgArr[3].pic}`}
              alt={`${imgArr[3].reviewId}`}
              onClick={handleImageClick}
            />
          </li>
          <li className="col-start-4 col-end-5 row-start-3 row-end-5 bg-slate-200">
            <img
              className="w-full h-full object-cover cursor-pointer"
              src={`${ReviewPic}${reviewId}/${imgArr[4].pic}`}
              alt={`${imgArr[4].reviewId}`}
              onClick={handleImageClick}
            />
          </li>
        </ul>
      )}
      {imgArrLeng > 5 && (
        <ul className="h-[400px] grid grid-cols-4 grid-rows-4 gap-2.5 rounded-lg overflow-hidden">
          <li className="col-start-1 col-end-3 row-start-1 row-end-5 bg-slate-200">
            <img
              className="w-full h-full object-cover cursor-pointer"
              src={`${ReviewPic}${reviewId}/${imgArr[0].pic}`}
              alt={`${imgArr[0].reviewId}`}
              onClick={handleImageClick}
            />
          </li>
          <li className="col-start-3 col-end-4 row-start-1 row-end-3 bg-slate-200">
            <img
              className="w-full h-full object-cover cursor-pointer"
              src={`${ReviewPic}${reviewId}/${imgArr[1].pic}`}
              alt={`${imgArr[1].reviewId}`}
              onClick={handleImageClick}
            />
          </li>
          <li className="col-start-3 col-end-4 row-start-3 row-end-5 bg-slate-200">
            <img
              className="w-full h-full object-cover cursor-pointer"
              src={`${ReviewPic}${reviewId}/${imgArr[2].pic}`}
              alt={`${imgArr[2].reviewId}`}
              onClick={handleImageClick}
            />
          </li>
          <li className="col-start-4 col-end-5 row-start-1 row-end-3 bg-slate-200">
            <img
              className="w-full h-full object-cover cursor-pointer"
              src={`${ReviewPic}${reviewId}/${imgArr[3].pic}`}
              alt={`${imgArr[3].reviewId}`}
              onClick={handleImageClick}
            />
          </li>
          <li className="col-start-4 col-end-5 row-start-3 row-end-5 bg-slate-200 relative rounded-lg">
            <img
              className="w-full h-full object-cover cursor-pointer"
              src={`${ReviewPic}${reviewId}/${imgArr[4].pic}`}
              alt={`${imgArr[4].reviewId}`}
              onClick={handleImageClick}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 content-[''] z-10 flex items-center justify-center text-white rounded-lg">
              + {imgArrLeng - 5}
            </div>
          </li>
        </ul>
      )}
      {/* 클릭 시 확대 */}
      {showSwiper && (
        <div
          className="fixed max-w-3xl w-full mx-auto h-screen h-screen top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col px-[32px] py-[30px] gap-[30px] bg-black bg-opacity-50 z-50"
          onClick={handleCloseSwiper}
        >
          <div className="max-w-3xl h-screen absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center px-[32px]">
            <Swiper
              slidesPerView={1}
              spaceBetween={0}
              loop={true}
              className="mySwiper w-full h-[406px] rounded-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {imgArr.map((item, index) => {
                return (
                  <SwiperSlide key={index}>
                    <img
                      src={`${ReviewPic}${reviewId}/${item.pic}`}
                      alt={`${item.reviewId}`}
                      className="w-full h-full object-contain"
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewImage;
