import axios from "axios";
import { useEffect, useState } from "react";
import { BiShow, BiSolidEditAlt, BiTrash } from "react-icons/bi";
import { CgMoreVerticalAlt } from "react-icons/cg";
import { GoThumbsup } from "react-icons/go";
import { MdOutlineContentCopy } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import jwtAxios from "../../../apis/jwt";
import BottomSheet from "../../../components/basic/BottomSheet";
import TitleHeader from "../../../components/layout/header/TitleHeader";
import { TripReviewPic } from "../../../constants/pic";
import Footer from "../../Footer";

const UserTrip = () => {
  const [myTrip, setMyTrip] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const navigate = useNavigate();

  const getTravelPost = async () => {
    try {
      const res = await jwtAxios.get(
        `/api/trip-review/myTripReview?orderType=latest`,
      );
      setMyTrip(res.data.data);
      console.log("✅  res.data.data:", res.data.data);
    } catch (error) {
      console.log("✅  error:", error);
    }
  };

  const deleteTravelPost = item => {
    console.log(item);
    try {
      const res = jwtAxios.delete(
        `/api/trip-review?tripReviewId=${item.tripReviewId}`,
      );
      console.log("✅  tripReviewId:", item.tripReviewId);
      console.log("Deleting item:", item);
      getTravelPost();
    } catch (error) {
      console.log("✅  error:", error);
    }
  };

  const navigateDetail = item => {
    navigate(
      `/scheduleboard/scheduleDetail?tripId=${item.tripId}&TripReviewId=${item.tripReviewId}`,
    );
  };

  const postTripScrap = async () => {
    try {
      await jwtAxios.post(`/api/trip-review/scrap`, {
        tripReviewId: 76,
        copyTripId: 1148,
        newStartAt: "2025-04-01",
        newEndAt: "2025-04-11",
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getTravelPost();
  }, []);

  const actions = [
    {
      label: (
        <div className="flex items-center gap-3 text-lg">
          <MdOutlineContentCopy className="text-slate-400" /> 스크랩하기
        </div>
      ),
      onClick: () => postTripScrap(),
    },
    {
      label: (
        <div className="flex items-center gap-3 text-lg">
          <BiSolidEditAlt className="text-slate-400" /> 수정하기
        </div>
      ),
      onClick: () => console.log("인식"),
    },
    {
      label: (
        <div className="flex items-center gap-3 text-lg">
          <BiTrash className="text-slate-400" /> 삭제하기
        </div>
      ),
      onClick: () => {
        if (selectedItem) {
          deleteTravelPost(selectedItem); // 선택된 아이템을 삭제
          setIsOpen(false);
        }
      },
    },
  ];

  return (
    <div>
      <TitleHeader icon="back" title="내 여행기" onClick={() => navigate(-1)} />
      <div className="flex justify-between py-[14px] px-4 border-b-[1px] border-t-[1px] border-slate-100 ">
        <p className="text-sm font-semibold">총 {myTrip.length}개</p>
      </div>
      <div>
        {myTrip?.map((item, index) => {
          return (
            <li
              className="flex flex-col gap-4 px-4 py-8 cursor-pointer border-b-[10px] border-slate-100 last:border-none"
              key={index}
              onClick={() => navigateDetail(item)}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-slate-700">
                  {item.title}
                </h3>
                <CgMoreVerticalAlt
                  className="text-slate-400 text-2xl cursor-pointer"
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedItem(item);
                    setIsOpen(true);
                  }}
                />
              </div>
              {/* info */}
              {/* content */}
              <div className="flex flex-col gap-4">
                {/* 이미지 */}
                <div className="w-full min-h-48 aspect-[3/2] bg-slate-200 rounded-lg overflow-hidden">
                  <img
                    src={
                      item.tripReviewPics !== null
                        ? `${TripReviewPic}${item.tripReviewId}/${item.tripReviewPics[0]}`
                        : ``
                    }
                    alt="여행기 사진"
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="text-base text-slate-500 line-clamp-3 tracking-tight">
                  {item.content}
                </p>
              </div>
              <ul className="flex items-center justify-end gap-3">
                <li className="flex items-center text-sm text-slate-500 font-semibold gap-0.5">
                  <BiShow className="text-base text-slate-300" />
                  <span>{item.recentCount}</span>
                </li>
                <li className="flex items-center text-sm text-slate-500 font-semibold gap-0.5">
                  <GoThumbsup className="text-base text-slate-300" />
                  <span>{item.likeCount}</span>
                </li>
                <li className="flex items-center text-sm text-slate-500 font-semibold gap-0.5">
                  <MdOutlineContentCopy className="text-base text-slate-300" />
                  <span>{item.scrapCount}</span>
                </li>
              </ul>
            </li>
          );
        })}
      </div>
      <Footer />
      <BottomSheet
        open={isOpen}
        onClose={() => setIsOpen(false)}
        actions={actions}
      />
    </div>
  );
};

export default UserTrip;
