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
import { CgMoreVerticalAlt } from "react-icons/cg";
import BottomSheet from "../../../components/basic/BottomSheet";
import { BiSolidEditAlt, BiTrash } from "react-icons/bi";

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
      className={`grid gap-1 ${gridClass} w-full aspect-[3/2] rounded-lg overflow-hidden`}
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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // 선택된 아이템 상태 추가
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
    if (startIndex > 0) {
      getUserReviewMore();
    } else {
      getUserReview();
    }
  }, [startIndex]);
  // startIndex가 변경될 때마다 getUserReview 호출

  const navigate = useNavigate();

  const actions = item => [
    {
      label: (
        <div className="flex items-center gap-3 text-lg">
          <BiSolidEditAlt className="text-slate-400" /> 수정하기
        </div>
      ),
      onClick: () => {
        console.log("인식");
      },
    },
    {
      label: (
        <div className="flex items-center gap-3 text-lg">
          <BiTrash className="text-slate-400" />
          삭제하기
        </div>
      ),
      onClick: () => {
        deleteReview(item);
        setIsOpen(false);
      },
    },
  ];

  return (
    <div>
      <TitleHeader icon="back" title="리뷰" onClick={() => navigate(-2)} />
      <div className="flex justify-between py-[14px] px-4 border-b-[1px] border-t-[1px] border-slate-100 ">
        <p className="text-sm font-semibold">총 {reviewInfo.length}개</p>
      </div>
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
                    className="flex items-center gap-2 h text-lg font-semibold text-slate-700 mb-2 cursor-pointer"
                    onClick={() =>
                      navigate(`/contents/index?strfId=${item.strfId}`)
                    }
                  >
                    {item.strfTitle}
                    <IoIosArrowForward />
                  </h1>
                </div>
                <CgMoreVerticalAlt
                  className="text-xl cursor-pointer"
                  onClick={e => {
                    setIsOpen(true);
                    setSelectedItem(item); // 선택된 아이템 설정
                  }}
                />
              </div>

              <div className="flex items-center gap-3 mb-2">
                <Rate
                  className="custom-rate flex items-center gap-[2px]"
                  disabled
                  allowHalf
                  defaultValue={item.rating}
                />
                <p className="text-slate-400 text-base">
                  {item.reviewWriteDate.split(" ")[0].replace(/-/g, ".")}
                </p>
              </div>
              <p className="text-base text-slate-700 mb-2">{item.content}</p>
              {/* ✅ 기존 코드 → DynamicGrid 컴포넌트로 변경 */}
              <DynamicGrid images={imageUrls} />
            </div>
          );
        })}
        {isShowMore && (
          <div className="flex justify-center py-[14px]">
            <Button
              className="text-slate-500 text-base !h-auto py-2 px-5 border-1 border-slate-200 rounded-full"
              onClick={() => {
                setStartIndex(prev => prev + 10);
              }}
            >
              더보기
            </Button>
          </div>
        )}
      </div>
      <BottomSheet
        open={isOpen}
        onClose={() => setIsOpen(false)}
        actions={selectedItem ? actions(selectedItem) : []} // 선택된 아이템을 actions에 전달
      />
    </div>
  );
};
export default UserrRview;
