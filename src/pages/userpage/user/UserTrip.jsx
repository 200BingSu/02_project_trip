import { useNavigate } from "react-router-dom";
import TitleHeader from "../../../components/layout/header/TitleHeader";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "../../../utils/cookie";
import { BiShow } from "react-icons/bi";
import { GoThumbsup } from "react-icons/go";
import { IoReaderOutline } from "react-icons/io5";
import { TripReviewPic } from "../../../constants/pic";

const UserTrip = () => {
  const [myTrip, setMyTrip] = useState([]);
  const accessToken = getCookie("accessToken");
  const navigate = useNavigate();

  const getTravelPost = async () => {
    try {
      const res = await axios.get(
        `/api/trip-review/myTripReview?orderType=latest`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
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
      const res = axios.delete(
        `/api/trip-review?tripReviewId=${item.tripReviewId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log("✅  tripReviewId:", item.tripReviewId);
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

  useEffect(() => {
    getTravelPost();
  }, []);

  return (
    <div>
      <TitleHeader icon="back" title="내 여행기" onClick={() => navigate(-1)} />
      <div className="px-8 mt-9">
        {myTrip?.map((item, index) => {
          return (
            <li
              className="flex flex-col gap-[20px] px-[30px] py-[30px] rounded-3xl
                  shadow-[0_0_10px_0_rgba(0,0,0,0.1)] cursor-pointer mb-8"
              key={index}
              onClick={() => navigateDetail(item)}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[24px] text-slate-700">
                  {item.title}
                </h3>
                <p
                  className="text-slate-700 bg-slate-100 py-1 px-3 rounded-lg"
                  onClick={e => {
                    e.stopPropagation();
                    deleteTravelPost(item);
                  }}
                >
                  삭제
                </p>
              </div>
              {/* info */}
              {/* content */}
              <div className="flex flex-col gap-[20px]">
                {/* 이미지 */}
                <div className="w-full h-[322px] bg-slate-200 rounded-2xl overflow-hidden">
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

                <p className="text-[18px] text-slate-500 line-clamp-3">
                  {item.content}
                </p>
              </div>
            </li>
          );
        })}
      </div>
    </div>
  );
};

export default UserTrip;
