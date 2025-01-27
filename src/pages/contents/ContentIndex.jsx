import { useSearchParams } from "react-router-dom";
import { CONTENT } from "../../constants/api";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaLocationDot } from "react-icons/fa6";
import { Rate } from "antd";
import { AiTwotoneHeart } from "react-icons/ai";
import { BiTime } from "react-icons/bi";
import { BiDownload } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import moment from "moment";
import dayjs from "dayjs";

const ContentDetail = () => {
  // 쿼리 스트링 조회
  const [searchParams] = useSearchParams();
  const strfType = searchParams.get("strf");
  const strfId = searchParams.get("strfId");
  //useState
  const [contentData, setContentData] = useState(null);

  // 상품 조회
  const getDetail = async () => {
    try {
      const res = await axios.get(`${CONTENT.getDetail}${strfId}`);
      const resultData = res.data.data;
      console.log("resultData", resultData);
      setContentData(resultData);
    } catch (error) {
      console.log("상품조회", error);
    }
  };
  useEffect(() => {
    getDetail();
  }, []);

  // 카테고리 한글 변환
  const categoryKor = category => {
    if (category === "STAY") return "호텔";
    if (category === "RESTAUR") return "식당";
    if (category === "TOUR") return "관광지";
    if (category === "FEST") return "축제";
    if (category === null) return "카테고리";
  };

  // 영업 시간 변환
  const timeFormat = time => {
    if (!time) return "N/A";
    return dayjs(time, "HH:mm").isValid()
      ? dayjs(time, "HH:mm").format("HH:mm")
      : "Invalid format";
  };
  const now = dayjs().format("HH:mm");

  return (
    <div>
      {/* 헤더 */}
      <div>
        헤더(임시): contents?strf={strfType}&strfId={strfId}
      </div>
      {/* 메인 썸네일 */}
      <div className="w-full h-[467px] bg-gray-200">
        <img
          src={contentData?.thumbnail}
          alt="content-thumbnail"
          className="w-full h-full object-cover"
        />
      </div>
      {/* 컨텐츠 영역 */}
      <div className="w-full flex flex-col gap-[30px] px-[32px] py-[30px]">
        {/* 컨텐츠 영역 상단 */}
        <div className="w-full flex flex-col gap-[10px]">
          {/* 카테고리 */}
          <div className="text-[16px] text-slate-500">
            {categoryKor(contentData?.category || null)}
          </div>
          {/* 컨텐츠 타이틀 */}
          <div className="font-semibold text-[36px] text-slate-700 line">
            {contentData?.strfTitle || "제목"}
          </div>
          {/* 주소 */}
          <div className="flex gap-[5px] items-center">
            <FaLocationDot className="text-[18px] text-slate-300" />
            <p className="text-[16px] text-slate-700">
              {contentData?.address || "주소"}
            </p>
          </div>
          {/* 별점 및 찜하기*/}
          <div className="flex gap-[20px] items-center">
            {/* 별점 */}
            <div className="flex gap-[5px] items-center">
              <Rate disabled count={1} value={1} />
              <p className="text-[16px] text-slate-700 font-semibold">
                {contentData?.ratingAvg || "평점"}
              </p>
              <p className="text-[16px] text-primary underline">
                리뷰 {(contentData?.ratingCnt || 1000).toLocaleString()}개
              </p>
            </div>
            <p className="text-[16px] text-slate-300 font-light">|</p>
            {/* 찜하기 */}
            <div className="flex gap-[5px] items-center">
              <AiTwotoneHeart className="text-[18px] text-slate-100" />
              <p className="text-[16px] text-slate-700">
                {(contentData?.wishCnt || 1000).toLocaleString()}
              </p>
            </div>
          </div>
          {/* 영업 시간 */}
          {/* 숙소 */}
          {contentData?.category === "STAY" && (
            <div className="flex gap-[5px] items-center">
              <BiTime className="text-[24px] text-slate-500" />
              <span className="text-[18px] text-slate-500">매일</span>
              <span className="text-[18px] text-slate-500">
                {contentData?.open && timeFormat(contentData?.open)}
              </span>
              <span className="text-[18px] text-slate-500">~</span>
              <span className="text-[18px] text-slate-500">
                {contentData?.close &&
                  timeFormat(contentData?.close || "11:59:00")}
              </span>
            </div>
          )}
          {/* 식당 */}
          {contentData?.category === "RESTAUR" && (
            <div className="flex gap-[5px] items-center">
              <BiTime className="text-[24px] text-slate-500" />
              <span className="text-[18px] text-slate-700">
                {now.isBetween(
                  timeFormat(contentData?.open),
                  timeFormat(contentData?.close),
                  null,
                  "[]",
                )
                  ? "영업중"
                  : "영업 종료"}
              </span>
              <span className="text-[18px] text-slate-500">|</span>
              <span className="text-[18px] text-slate-500">
                {contentData?.close && timeFormat(contentData?.close)} 영업 종료
              </span>
              <span>
                <IoIosArrowDown />
              </span>
            </div>
          )}
          {/* 관광지 */}
          {contentData?.category === "TOUR" && (
            <div className="flex gap-[5px] items-center">
              <BiTime className="text-[24px] text-slate-500" />
              <span className="text-[18px] text-slate-500">매일</span>
              <span className="text-[18px] text-slate-500">
                {contentData?.open && timeFormat(contentData?.open)}
              </span>
              <span className="text-[18px] text-slate-500">~</span>
              <span className="text-[18px] text-slate-500">
                {contentData?.close && timeFormat(contentData?.close)}
              </span>
            </div>
          )}
          {/* 축제 */}
          {contentData?.category === "FEST" && (
            <div className="flex gap-[5px] items-center">
              <BiTime className="text-[24px] text-slate-500" />
              <span className="text-[18px] text-slate-500">매일</span>
              <span className="text-[18px] text-slate-500">
                {contentData?.open && timeFormat(contentData?.open)}
              </span>
              <span className="text-[18px] text-slate-500">~</span>
              <span className="text-[18px] text-slate-500">
                {contentData?.close && timeFormat(contentData?.close)}
              </span>
            </div>
          )}
        </div>
        {/* 쿠폰 */}
        <div
          className="w-full flex gap-[10px] 
          items-center justify-between
          px-[20px] py-[16px] rounded-2xl 
          bg-white border border-slate-200 shadow-[0_0_7px_0_rgba(0,0,0,0.2)]"
        >
          <p className="text-[18px] font-semibold">최대 n% 할인</p>
          <button
            type="button"
            className="flex gap-[10px] items-center px-[15px] py-[10px] rounded-3xl bg-secondary2 text-white text-[16px] font-semibold"
          >
            <BiDownload />
            쿠폰 받기
          </button>
        </div>
        {/* 라인 */}
        <div className="w-full h-[10px] bg-slate-100"></div>
        {/* 숙박: 날짜, 인원 */}
        {contentData?.category === "STAY" && <div>숙박: 날짜, 인원</div>}
        {/* 컨텐츠 영역 컨텐츠 */}
        <div>
          {/* 메뉴 */}
          <div>메뉴</div>
          {/* 편의 시설 및 서비스 */}
          {contentData?.category === "STAY" && <div>편의 시설 및 서비스</div>}
          {/* 상세 정보 */}
          <div>상세 정보</div>
          {/* 리뷰 */}
          <div>리뷰</div>
        </div>
      </div>
    </div>
  );
};
export default ContentDetail;
