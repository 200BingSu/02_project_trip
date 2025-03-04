import { Button, Rate } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { AiFillStar, AiOutlinePlus } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import TitleHeader from "../../../components/layout/header/TitleHeader";
import { ReviewPic } from "../../../constants/pic";
import "../../../styles/antd-styles.css";
import { getCookie } from "../../../utils/cookie";
import { RiCloseLargeFill } from "react-icons/ri";
import jwtAxios from "../../../apis/jwt";

// ✅ DynamicGrid 컴포넌트 추가
const DynamicGrid = ({ images }) => {
  const imageCount = images.length;

  // Tailwind 동적 클래스 설정
  const gridClass =
    {
      1: "grid-cols-1 grid-rows-1",
      2: "grid-cols-2 grid-rows-1",
      3: "grid-cols-2 grid-rows-2",
      4: "grid-cols-2 grid-rows-2",
      5: "grid-cols-4 grid-rows-2",
    }[imageCount] || "grid-cols-3 grid-rows-2"; // 기본값 (5개 이상)

  return (
    <div
      className={`grid gap-2 ${gridClass} w-full h-[400px] rounded-lg overflow-hidden`}
    >
      {images.map((src, index) => {
        let extraClass = "";
        if (imageCount === 3 && index === 0) extraClass = "row-span-2";
        if (imageCount === 5) {
          if (index === 0) extraClass = "row-span-2 col-span-2"; // 첫 번째 이미지 (2행 1열)
        }

        return (
          <img
            key={index}
            src={src}
            alt={`image-${index}`}
            className={`w-full h-full overflow-hidden object-cover ${extraClass}`}
          />
        );
      })}
    </div>
  );
};

const UserrRview = () => {
  const [reviewInfo, setReviewInfo] = useState([]);
  const [startIndex, setStartIndex] = useState(0); // startIndex 상태 추가
  const [isShowMore, setIsShowMore] = useState(true);
  const accessToken = getCookie("accessToken");

  // 사용자 리뷰를 더 가져오기
  const getUserReviewMore = async () => {
    try {
      const res = await axios.get(`/api/review/my?start_idx=${startIndex}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setReviewInfo(prev => [...prev, ...res.data]); // 기존 리뷰에 새 리뷰 추가
      if (res.data.more === false) {
        setIsShowMore(false);
      }
      console.log("✅  getUserReview  res.data.data:", res.data);
    } catch (error) {
      console.log("✅  getUserReview  error:", error);
    }
  };
  // 사용자 리뷰를 가져오기
  const getUserReview = async () => {
    try {
      const res = await axios.get(`/api/review/my?start_idx=${startIndex}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setReviewInfo(res.data); // 기존 리뷰에 새 리뷰 추가
      console.log("✅  getUserReview  res.data.data:", res.data);
      if (res.data.more === false) {
        setIsShowMore(false);
      }
    } catch (error) {
      console.log("✅  getUserReview  error:", error);
    }
  };
  // 리뷰 삭제하기
  const deleteReview = async item => {
    console.log(item);
    try {
      const res = await jwtAxios.delete(
        `/api/review/del?review_id=${item.reviewId}`,
      );
      console.log("리뷰 삭제:", res.data);
      if (res.data) {
        getUserReview();
      }
    } catch (error) {
      console.log("리뷰 삭제:", error);
    }
  };

  useEffect(() => {
    getUserReview();
  }, [startIndex]);
  // startIndex가 변경될 때마다 getUserReview 호출

  const navigate = useNavigate();

  return (
    <div>
      <TitleHeader icon="back" title="리뷰" onClick={() => navigate(-2)} />
      <div className="px-4">
        <div>
          <p></p>
          <p></p>
        </div>
        {reviewInfo.map((item, index) => {
          const imageUrls = item.myReviewPic.map(
            pic => `${ReviewPic}${item.reviewId}/${pic.pic}`,
          );

          return (
            <div key={index} className="py-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1
                    className="flex items-center gap-5 h text-3xl font-bold text-slate-700 mb-3 cursor-pointer"
                    onClick={() =>
                      navigate(`/contents/index?strfId=${item.strfId}`)
                    }
                  >
                    {item.strfTitle}
                    <IoIosArrowForward />
                  </h1>
                </div>
                <button
                  type="button"
                  className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-[16px]"
                  onClick={() => deleteReview(item)}
                >
                  삭제
                </button>
              </div>

              <div className="flex items-center gap-3 mb-8">
                <Rate
                  className="custom-rate flex items-center gap-1"
                  disabled
                  allowHalf
                  defaultValue={item.rating}
                />
                <p className="text-slate-500 text-xl">
                  {item.reviewWriteDate.split(" ")[0]}
                </p>
              </div>
              <p className="text-2xl text-slate-700 mb-10 font-normal">
                {item.content}
              </p>
              {/* ✅ 기존 코드 → DynamicGrid 컴포넌트로 변경 */}
              <DynamicGrid images={imageUrls} />
            </div>
          );
        })}
        {isShowMore && (
          <div className="flex justify-center mb-14">
            <Button onClick={() => setStartIndex(prev => prev + 10)}>
              <AiOutlinePlus />
              더보기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default UserrRview;
