import { Button } from "antd";
import React, { useState } from "react";
import ContentsMap from "./ContentsMap";

const DetailInfo = ({ contentData }) => {
  // useState
  const [openDetail, setOpenDetail] = useState(false);

  return (
    <div className="flex flex-col gap-[30px]">
      {/* 소개 */}
      <div className="flex flex-col gap-[30px]">
        <h2 className="text-[28px] font-semibold text-slate-700">소개</h2>
        {/* 소개글 */}
        <div
          className={`relative w-full transition-all h-auto ${openDetail ? `` : `before:absolute before:inset-0 before:bg-gradient-to-t before:from-white/100 before:to-white/0`}`}
        >
          <p
            className={`text-[18px] text-slate-500 ${openDetail ? `` : `line-clamp-5`}`}
          >
            {contentData
              ? contentData.detail
              : `홀리데이 인 광주호텔은 광주공항, 광주송정 KTX역, 고속버스터미널, 지하철역 등의 주요 교통 요지에 매우 밀접하게 자리해 지역 관광 명소뿐만 아니라 근교 관광 도시 방문에 매우 편리합니다.
              또한 광주 MICE의 중심지 김대중컨벤션센터 바로 건너편에 위치해 있어 비즈니스와 여가 모두에 적합한 광주 유일의 인터내셔널 브랜드 호텔입니다.
              
              호텔 외관을 아름답게 수놓고 있는 조명의 거장 Alian Guilhot의 조명 작품과 로비 가득 전시된 세계적으로 유명한 작가들의 작품이 문화예술의 도시 광주에 오신 여러분을 맞이합니다.
              동급 호텔 전용 면적 대비 넓고 현대적인 공간 구성이 특징인 203개의 객실은 광주의 진산 무등산 너덜겅에서 영감을 받은 999개의 다양한 크기와 모양의 창문에서 쏟아져 들어오는 따스한 자연 채광을 자랑합니다. 각 객실마다 40인치 평면 TV, 푹신한 침구, 베개 타입 선택 옵션(Pillow Choice), 무료 초고속 와이파이가 마련되어 있습니다.
              
              호남 지역 최고의 럭셔리 스파와 투숙객 전용 실내 수영장, 최신 장비를 완비한 피트니스센터 그리고 사우나는 진정한 도심 속 휴식과 채움의 시간을 제공합니다.
              다양한 규모 및 행사의 성격에 따라 이용 가능한 7개의 이벤트 공간은 대규모 컨벤션, 중소 규모의 회의, 고품격 웨딩, 프라이빗한 가족모임까지 다목적 행사를 진행하시기에 부족함이 없습니다.
              매혹적인 광주 야경을 배경으로 총주방장의 독창적인 코스 요리를 즐길 수 있는 라 플레이스 그릴&바, 세련된 인테리어의 디오니소스 카페&바, 제철 로컬 식재료를 활용한 뷔페와 일품 메뉴를 선보이고 있는 모래시계 레스토랑이 풍부한 미식의 세계로 인도합니다.`}
          </p>
        </div>
        <button
          type="button"
          className="w-full py-[20px] border border-slate-300 rounded-[8px]"
          style={{ color: "#C2C6CC" }}
          onClick={() => {
            setOpenDetail(!openDetail);
          }}
        >
          펼치기
        </button>
      </div>
      {/* 위치 */}
      <div className="flex flex-col gap-[20px]">
        <h2 className="text-[28px] font-semibold text-slate-700">위치</h2>
        <ContentsMap contentData={contentData} />
        {/* info */}
        <ul className="flex flex-col gap-3 px-5 py-[30px]">
          <li className="flex gap-[10px]">
            <h3 className="text-[18px] text-slate-700 font-semibold">주소</h3>
            <p className="text=[18px] text-slate-400">
              {contentData?.address || "주소입니다."}
            </p>
          </li>
          <li className="flex gap-[10px]">
            <h3 className="text-[18px] text-slate-700 font-semibold">전화</h3>
            <p className="text=[18px] text-slate-400">
              {contentData?.tell || "전화번호입니다."}
            </p>
          </li>
          <li className="flex gap-[10px]">
            <h3 className="text-[18px] text-slate-700 font-semibold">
              사업자 번호
            </h3>
            <p className="text=[18px] text-slate-400">
              {contentData?.busiNum || "사업자 번호입니다."}
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DetailInfo;
