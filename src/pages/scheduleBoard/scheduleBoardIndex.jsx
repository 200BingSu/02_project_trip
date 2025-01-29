import { useNavigate } from "react-router-dom";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { Skeleton } from "antd";
import { FiSearch } from "react-icons/fi";
import { useState } from "react";
import { BiShow } from "react-icons/bi";
import { GoThumbsup } from "react-icons/go";
import { IoReaderOutline } from "react-icons/io5";

const scheduleBoardIndex = () => {
  //useNavigate
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate(-1);
  };
  const navigateSearchLocation = () => {
    navigate(`/search/location`, { state: { from: "/scheduleboard/index" } });
  };
  const navigateDetail = tripId => {
    navigate(`/scheduleboard/scheduleDetail?tripId=${tripId}`);
  };
  //useState
  const [filter, setFilter] = useState(0);

  return (
    <div>
      <TitleHeader onClick={navigateBack} title="여행기" icon="back" />
      <div className="flex flex-col px-[32px] mt-[60px]">
        {/* 지역 검색바 */}
        <div className="relative">
          <input
            placeholder={"어느 곳으로 가실건가요?"}
            className="
          flex gap-[10px] px-[46px] py-[8px] w-full
          bg-slate-100 hover:bg-[#eef3f7] 
          rounded-3xl h-[80px]"
          />
          <FiSearch className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[24px] text-slate-400" />
        </div>
        {/* 순서, 총 건수 */}
        <div className="flex justify-between items-center py-[30px]">
          {/* 순서 */}
          <ul className="flex gap-[20px] items-center">
            <li>
              <button
                type="button"
                value={0}
                className={`${filter === 0 ? "text-primary" : "text-slate-300"}`}
                onClick={() => {
                  setFilter(0);
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
                }}
              >
                • 최신순
              </button>
            </li>
          </ul>
          <p>총 {(2000).toLocaleString()}건</p>
        </div>
        {/* 여행기 목록 */}
        <ul className="flex flex-col gap-[30px]">
          <li
            className="flex flex-col gap-[20px] px-[30px] py-[30px] rounded-3xl
          shadow-[0_0_10px_0_rgba(0,0,0,0.1)] cursor-pointer"
            onClick={() => navigateDetail(1)}
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
                <p className="font-semibold text-[18px] text-slate-700">
                  닉네임
                </p>
              </div>
              {/* 조회수, 좋아요, 여행기 작성수 */}
              <ul className="flex gap-[10px] items-center">
                <li className="flex gap-[5px] items-center">
                  <BiShow className="text-slate-300 text-[18px]" />
                  <p className="text-slate-500 font-bold text-[14px]">조회수</p>
                </li>
                <li className="flex gap-[5px] items-center">
                  <GoThumbsup className="text-slate-300 text-[18px]" />
                  <p className="text-slate-500 font-bold text-[14px]">좋아요</p>
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
                  src=""
                  alt="여행기 사진"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-[24px] text-slate-700">제목</h3>
              <p className="text-[18px] text-slate-500 line-clamp-3">
                1일차- 제주, 2일차-서귀포’ 함덕, 3일차-성산 기름값 4만원 태우며
                렌터카로 알차게 돌아다님. 참고로 2박 3일간 제주 투어패스 48시간
                끊었는데 강추!!2박 3일간 제주 투어패스 48시간 끊었는데 강추!!2박
                3일간 제주...
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default scheduleBoardIndex;
