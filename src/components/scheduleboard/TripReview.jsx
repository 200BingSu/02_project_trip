const TripReview = () => {
  return (
    <li
      className="flex flex-col gap-[20px] px-[30px] py-[30px] rounded-3xl
                        shadow-[0_0_10px_0_rgba(0,0,0,0.1)] cursor-pointer"
      key={index}
      onClick={() => navigateDetail(item.tripId)}
    >
      {/* info */}
      <div className="flex justify-between items-center">
        {/* 유저 */}
        <div className="flex items-center gap-[10px]">
          {/* 프로필 */}
          <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
            <Skeleton.Avatar style={{ width: "50px", height: "50px" }} />
          </div>
          {/* 닉네임 */}
          <p className="font-semibold text-[18px] text-slate-700">닉네임</p>
        </div>
        {/* 조회수, 좋아요, 여행기 작성수 */}
        <ul className="flex gap-[10px] items-center">
          <li className="flex gap-[5px] items-center">
            <BiShow className="text-slate-300 text-[18px]" />
            <p className="text-slate-500 font-bold text-[14px]">조회수</p>
          </li>
          <li className="flex gap-[5px] items-center">
            <GoThumbsup className="text-slate-300 text-[18px]" />
            <p className="text-slate-500 font-bold text-[14px]">
              {item.likeCount}
            </p>
          </li>
          <li className="flex gap-[5px] items-center">
            <IoReaderOutline className="text-slate-300 text-[18px]" />
            <p className="text-slate-500 font-bold text-[14px]">작성수</p>
          </li>
        </ul>
      </div>
      {/* content */}
      <div className="flex flex-col gap-[20px]">
        {/* 이미지 */}
        <div className="w-full h-[322px] bg-slate-200 rounded-2xl">
          <img
            src={`${TripReviewPic}${item.tripReviewId}/${item.tripReviewPics[0]}`}
            alt="여행기 사진"
            className="w-full h-full object-cover"
            ref={imgRef}
          />
        </div>
        <h3 className="font-semibold text-[24px] text-slate-700">
          {item.title}
        </h3>
        <p className="text-[18px] text-slate-500 line-clamp-3">
          {item.content}
        </p>
      </div>
    </li>
  );
};
export default TripReview;
