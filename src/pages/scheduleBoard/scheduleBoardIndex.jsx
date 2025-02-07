import { useLocation, useNavigate } from "react-router-dom";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { Button, Skeleton } from "antd";
import { FiSearch } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { BiShow } from "react-icons/bi";
import { GoThumbsup } from "react-icons/go";
import { IoReaderOutline } from "react-icons/io5";
import axios from "axios";
import { ProfilePic, TripReviewPic } from "../../constants/pic";

const ScheduleBoardIndex = () => {
  //useNavigate
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate(-1);
  };
  const navigateSearchLocation = () => {
    navigate(`/search/location`, { state: { from: "/scheduleboard/index" } });
  };
  const navigateDetail = item => {
    navigate(
      `/scheduleboard/scheduleDetail?tripId=${item.tripId}&TripReviewId=${item.tripReviewId}`,
    );
  };
  const location = useLocation();
  const locationState = location.state;
  console.log(locationState);
  //useState
  const imgRef = useRef(null);
  // console.log(imgRef.current);
  const [filter, setFilter] = useState(0);
  const [allTripReview, setAllTripReview] = useState([]);

  // 인덱스
  const [pageNumber, setPageNumber] = useState(1);
  useEffect(() => {
    console.log("pageNumber", pageNumber);
  }, []);
  useEffect(() => {
    console.log("여행기 배열", allTripReview);
  }, [allTripReview]);
  /**
   * ## 모든 여행기 조회
   * #### type
   * - "latest": 최신순
   * - "popular": 추천순
   */
  const getAllTripReview = async (type = "popular") => {
    console.log("부르는 페이지:", pageNumber);
    try {
      const res = await axios.get(
        `/api/trip-review/allTripReview?orderType=${type}&pageNumber=${pageNumber}`,
      );
      console.log(`여행기 모두 불러오기 ${type}`, res.data);
      const resultData = res.data;
      setAllTripReview([...allTripReview, ...resultData.data]);
      if (resultData.code === "200 성공") {
        setPageNumber(prev => prev + 1);
      }
    } catch (error) {
      console.log(`여행기 모두 불러오기 ${type}`, error);
    }
  };
  useEffect(() => {
    getAllTripReview();
  }, []);

  return (
    <div>
      <TitleHeader onClick={navigateBack} title="여행기" icon="back" />
      <div className="flex flex-col px-[32px]">
        {/* 지역 검색바 */}
        {/* <div className="relative" onClick={navigateSearchLocation}>
          <input
            placeholder={"어느 곳으로 가실건가요?"}
            className="
          flex gap-[10px] px-[46px] py-[8px] w-full
          bg-slate-100 hover:bg-[#eef3f7] 
          rounded-3xl h-[80px] outline-none text-slate-500"
            value={`${locationState?.length ? locationState.map(item => item.title).join(", ") : "어느곳으로 가실건가요?"}`}
            readOnly
          />
          <FiSearch className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[24px] text-slate-400" />
        </div> */}
        {/* 순서, 총 건수 */}
        <div className="flex justify-between items-center py-[30px]">
          {/* 정렬 방식 */}
          <ul className="flex gap-[20px] items-center">
            <li>
              <button
                type="button"
                value={0}
                className={`${filter === 0 ? "text-primary" : "text-slate-300"}`}
                onClick={() => {
                  setFilter(0);
                  getAllTripReview("popular");
                }}
              >
                • 추천순
              </button>
            </li>
            <li>
              <button
                type="button"
                value={1}
                className={`${filter === 1 ? "text-primary" : "text-slate-300"}`}
                onClick={() => {
                  setFilter(1);
                  getAllTripReview("latest");
                }}
              >
                • 최신순
              </button>
            </li>
          </ul>
          <p>총 {allTripReview?.length.toLocaleString()}건</p>
        </div>
        {/* 여행기 목록 */}
        <ul className="flex flex-col gap-[30px]">
          {allTripReview ? (
            allTripReview?.map((item, index) => {
              return (
                <li
                  className="flex flex-col gap-[20px] px-[30px] py-[30px] rounded-3xl
                        shadow-[0_0_10px_0_rgba(0,0,0,0.1)] cursor-pointer"
                  key={index}
                  onClick={() => navigateDetail(item)}
                >
                  {/* info */}
                  <div className="flex justify-between items-center">
                    {/* 유저 */}
                    <div className="flex items-center gap-[10px]">
                      {/* 프로필 */}
                      <div className="w-[50px] h-[50px] rounded-full overflow-hidden bg-slate-100">
                        <img
                          src={`${ProfilePic}${item.userId}/${item.profilePic}`}
                          alt=""
                        />
                      </div>
                      {/* 닉네임 */}
                      <p className="font-semibold text-[18px] text-slate-700">
                        {item.name}
                      </p>
                    </div>
                    {/* 조회수, 좋아요, 여행기 작성수 */}
                    <ul className="flex gap-[10px] items-center">
                      {/* <li className="flex gap-[5px] items-center">
                        <BiShow className="text-slate-300 text-[18px]" />
                        <p className="text-slate-500 font-bold text-[14px]">
                          조회수
                        </p>
                      </li> */}
                      <li className="flex gap-[5px] items-center">
                        <GoThumbsup className="text-slate-300 text-[18px]" />
                        <p className="text-slate-500 font-bold text-[14px]">
                          {item.likeCount}
                        </p>
                      </li>
                      <li className="flex gap-[5px] items-center">
                        <IoReaderOutline className="text-slate-300 text-[18px]" />
                        <p className="text-slate-500 font-bold text-[14px]">
                          {item.reviewCount.toLocaleString()}
                        </p>
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
            })
          ) : (
            <li
              className="flex flex-col gap-[20px] px-[30px] py-[30px] rounded-3xl
                        shadow-[0_0_10px_0_rgba(0,0,0,0.1)] cursor-pointer"
              onClick={() => navigateDetail(item)}
            >
              {/* info */}
              <div className="flex justify-between items-center">
                {/* 유저 */}
                <div className="flex items-center gap-[10px]">
                  {/* 프로필 */}
                  <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                    <Skeleton.Avatar
                      style={{ width: "50px", height: "50px" }}
                    />
                  </div>
                  {/* 닉네임 */}
                  <p className="font-semibold text-[18px] text-slate-700">
                    닉네임
                  </p>
                </div>
                {/* 조회수, 좋아요, 여행기 작성수 */}
                <ul className="flex gap-[10px] items-center">
                  <li className="flex gap-[5px] items-center">
                    <BiShow className="text-slate-300 text-[18px]" />
                    <p className="text-slate-500 font-bold text-[14px]">
                      조회수
                    </p>
                  </li>
                  <li className="flex gap-[5px] items-center">
                    <GoThumbsup className="text-slate-300 text-[18px]" />
                    <p className="text-slate-500 font-bold text-[14px]">
                      좋아요
                    </p>
                  </li>
                  <li className="flex gap-[5px] items-center">
                    <IoReaderOutline className="text-slate-300 text-[18px]" />
                    <p className="text-slate-500 font-bold text-[14px]">
                      작성수
                    </p>
                  </li>
                </ul>
              </div>
              {/* content */}
              <div className="flex flex-col gap-[20px]">
                {/* 이미지 */}
                <div className="w-full h-[322px] bg-slate-200 rounded-2xl">
                  <img
                    src=""
                    alt="여행기 사진"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-[24px] text-slate-700">
                  제목
                </h3>
                <p className="text-[18px] text-slate-500 line-clamp-3">
                  1일차- 제주, 2일차-서귀포’ 함덕, 3일차-성산 기름값 4만원
                  태우며 렌터카로 알차게 돌아다님. 참고로 2박 3일간 제주
                  투어패스 48시간 끊었는데 강추!!2박 3일간 제주 투어패스 48시간
                  끊었는데 강추!!2박 3일간 제주...
                </p>
              </div>
            </li>
          )}
        </ul>
        {/* 버튼 */}
        <div className="py-[20px]">
          <Button
            variant="outlined"
            className="w-full"
            onClick={() => getAllTripReview()}
          >
            더보기
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ScheduleBoardIndex;
