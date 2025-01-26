import { useSearchParams } from "react-router-dom";
import { CONTENT } from "../../constants/api";
import { useEffect, useState } from "react";
import axios from "axios";

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
  };
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
      <div>
        {/* 컨텐츠 영역 상단 */}
        <div>
          {/* 카테고리 */}
          <div>{categoryKor(contentData?.category)}</div>
          {/* 컨텐츠 타이틀 */}
          <div>{contentData?.title}</div>
          {/* 주소 */}
          <div>{contentData?.address}</div>
          {/* 별점 및 리뷰*/}
          <div>별점 및 리뷰</div>
          {/* 쿠폰 */}
          {contentData?.category === "STAY" && <div>쿠폰 발급</div>}
        </div>
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
