import { useState } from "react";

const RecommendList = ({ recommend }) => {
  // 현재 선택된 카테고리
  const [selectedCategory, setSelectedCategory] = useState("TOUR");

  // 현재 선택된 카테고리에 해당하는 데이터 필터링
  const filteredList = recommend.filter(
    item => item.category === selectedCategory,
  );

  const categoryTitle = {
    TOUR: "관광지",
    STAY: "숙소",
    RESTAUR: "맛집",
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">최근 본 목록</h1>
      {/* 탭 메뉴 */}
      <div className="flex space-x-4 mb-4">
        {Object.keys(categoryTitle).map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-2xl mt-[30px] mb-[30px] ${
              selectedCategory === category
                ? "bg-primary text-white"
                : "bg-white text-slate-500 border border-slate-300"
            }`}
          >
            {categoryTitle[category]}
          </button>
        ))}
      </div>

      {/* 필터링된 데이터 출력 */}
      <div>
        {filteredList.map(item => (
          <div key={item.strfId} className="p-4 border-b">
            <h3 className="font-bold">{item.strfTitle}</h3>
            <p>{item.locationTitle}</p>
            <p>{item.explain}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendList;
