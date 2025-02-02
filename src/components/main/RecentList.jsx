import { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Rate } from "antd";

const data = {
  recentList: [
    {
      category: "STAY",
      recent: [
        {
          strfId: 94,
          strfTitle: "호산여인숙",
          strfPic: "https://picsum.photos/200",
          locationName: "강진군",
          wishIn: false,
          averageRating: 2,
          wishCnt: 5,
        },
        {
          strfId: 95,
          strfTitle: "비바스호텔",
          strfPic: "https://picsum.photos/200",
          locationName: "대구광역시 ",
          wishIn: true,
          averageRating: 0,
          wishCnt: 10,
        },
        {
          strfId: 957,
          strfTitle: "브라운도트 호텔 사상르네시떼",
          strfPic: "https://picsum.photos/200",
          locationName: "부산광역시 ",
          wishIn: false,
          averageRating: 4,
          wishCnt: 5,
        },
        {
          strfId: 98,
          strfTitle: "홀리데이 인 광주 호텔",
          strfPic: "https://picsum.photos/200",
          locationName: "광주",
          wishIn: false,
          averageRating: 1.5,
          wishCnt: 5,
        },
        {
          strfId: 99,
          strfTitle: "덕구온천리조트 호텔&콘도",
          strfPic: "https://picsum.photos/200",
          locationName: "경북",
          wishIn: false,
          averageRating: 3,
          wishCnt: 5,
        },
        {
          strfId: 97,
          strfTitle: "유원재",
          strfPic: "https://picsum.photos/200",
          locationName: "충북",
          wishIn: true,
          averageRating: 0.5,
          wishCnt: 5,
        },
      ],
    },
    {
      category: "RESTAUR",
      recent: [
        {
          strfId: 65,
          strfTitle: "충무호동복",
          strfPic: "https://picsum.photos/200",
          locationName: "대구광역시",
          wishIn: true,
          averageRating: 5,
          wishCnt: 0,
        },
        {
          strfId: 131,
          strfTitle: "라뮤즈 드 연희",
          strfPic: "https://picsum.photos/200",
          locationName: "서울특별시",
          wishIn: true,
          averageRating: 0,
          wishCnt: 1,
        },
        {
          strfId: 1311,
          strfTitle: "태평소국밥(원조태평소국밥 태평본점)",
          strfPic: "https://picsum.photos/200",
          locationName: "대전",
          wishIn: false,
          averageRating: 1,
          wishCnt: 1,
        },
        {
          strfId: 1312,
          strfTitle: "조양방직",
          strfPic: "https://picsum.photos/200",
          locationName: "인천",
          wishIn: true,
          averageRating: 2.5,
          wishCnt: 1,
        },
        {
          strfId: 1313,
          strfTitle: "런던베이글뮤지엄",
          strfPic: "https://picsum.photos/200",
          locationName: "서울특별시",
          wishIn: false,
          averageRating: 3,
          wishCnt: 1,
        },
        {
          strfId: 1314,
          strfTitle: "키누카누 파주점",
          strfPic: "https://picsum.photos/200",
          locationName: "경기",
          wishIn: true,
          averageRating: 0,
          wishCnt: 1,
        },
        {
          strfId: 1315,
          strfTitle: "이재모피자 본점",
          strfPic: "https://picsum.photos/200",
          locationName: "부산",
          wishIn: false,
          averageRating: 4.5,
          wishCnt: 1,
        },
      ],
    },
    {
      category: "TOUR",
      recent: [
        {
          strfId: 70,
          strfTitle: "한강 나루터",
          strfPic: "https://picsum.photos/200",
          locationName: "서울특별시",
          wishIn: false,
          averageRating: 0.5,
          wishCnt: 0,
        },
        {
          strfId: 715,
          strfTitle: "한강 나루터",
          strfPic: "https://picsum.photos/200",
          locationName: "서울특별시",
          wishIn: true,
          averageRating: 0,
          wishCnt: 0,
        },
        {
          strfId: 7151,
          strfTitle: "원대리 자작나무 숲 (속삭이는 자작나무 숲)",
          strfPic: "https://picsum.photos/200",
          locationName: "강원",
          wishIn: true,
          averageRating: 0,
          wishCnt: 0,
        },
        {
          strfId: 71512,
          strfTitle: "",
          strfPic: "https://picsum.photos/200",
          locationName: "서울특별시",
          wishIn: false,
          averageRating: 3.5,
          wishCnt: 0,
        },
        {
          strfId: 71513,
          strfTitle: "간월암(서산)",
          strfPic: "https://picsum.photos/200",
          locationName: "충남",
          wishIn: true,
          averageRating: 0,
          wishCnt: 0,
        },
        {
          strfId: 71514,
          strfTitle: "라테라스 윈터빌리지 어드벤처",
          strfPic: "https://picsum.photos/200",
          locationName: "전남 ",
          wishIn: false,
          averageRating: 5,
          wishCnt: 0,
        },
      ],
    },
  ],
};

const RecentList = () => {
  const [activeTab, setActiveTab] = useState("STAY");

  const categoryNameMap = {
    STAY: "숙소",
    RESTAUR: "맛집",
    TOUR: "관광지",
  };

  const activeTabData = data.recentList.find(
    item => item.category === activeTab,
  );

  return (
    <div>
      <h1 className="text-3xl font-bold">최근 본 목록</h1>
      <div>
        {data.recentList.map(item => (
          <button
            key={item.category}
            onClick={() => setActiveTab(item.category)}
            className={`px-5 py-2 border cursor-pointer mr-2.5 my-8 rounded-2xl ${
              activeTab === item.category
                ? "bg-primary text-white"
                : "bg-white text-slate-500 border-1 border-slate-300"
            }`}
          >
            {categoryNameMap[item.category]}
          </button>
        ))}
      </div>

      <div className=" flex flex-wrap ">
        {activeTabData?.recent.slice(0, 6).map(content => (
          <div
            key={content.strfId}
            className="w-[50%] flex items-center gap-5 mb-5"
          >
            <div className="w-[164px] h-[164px] rounded-[16px] relative overflow-hidden flex-1">
              <img
                src={content.strfPic}
                alt={content.strfTitle}
                className="h-full"
              />
              <i className="absolute top-2.5 right-2.5 cursor-pointer">
                {content.wishIn ? (
                  <AiFillHeart className="text-secondary3 text-xl" />
                ) : (
                  <AiOutlineHeart className="text-white text-xl" />
                )}
              </i>
            </div>

            <div className="flex-1 pr-4">
              <h3 className="text-lg font-bold text-slate-700 break-keep">
                {content.strfTitle}
              </h3>
              <p className="font-medium text-base text-slate-400">
                {content.locationName} · {categoryNameMap[activeTab]}
              </p>

              <p>
                <Rate disabled allowHalf defaultValue={content.averageRating} />
              </p>
              <p className="flex text-slate-400 text-sm align-middle gap-1">
                {content.wishIn ? (
                  <AiFillHeart className="text-secondary3 text-xl" />
                ) : (
                  <AiOutlineHeart className="text-slate-400 text-xl" />
                )}
                {content.wishCnt}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentList;
