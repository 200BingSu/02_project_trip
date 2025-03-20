import { BiShow } from "react-icons/bi";
import { GoThumbsup } from "react-icons/go";
import { MdOutlineContentCopy } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ProfilePic, TripReviewPic } from "../../constants/pic";
import { ITripReview } from "../../types/interface";

interface TripReviewItemProps {
  item: ITripReview;
}

const TripReviewItem = ({ item }: TripReviewItemProps) => {
  const navigate = useNavigate();
  const navigateToDetail = () => {
    navigate(
      `/scheduleboard/scheduleDetail?tripId=${item.tripId}&TripReviewId=${item.tripReviewId}`,
    );
  };

  return (
    <div
      className="flex flex-col gap-4 border-b-8 border-slate-100 px-4 py-6"
      onClick={navigateToDetail}
    >
      {/* 유저 정보 */}
      <section className="flex items-center gap-4 pt-6">
        {/* 사진 */}
        <div className="w-8 aspect-square rounded-full overflow-hidden bg-slate-200">
          <img
            src={`${ProfilePic}/${item.userId}/${item.profilePic}`}
            alt={item.profilePic}
            className="w-full h-full object-cover"
          />
        </div>
        {/* 이름 */}
        <p className="text-base text-slate-700 font-semibold">{item.name}</p>
      </section>
      {/* 리뷰 */}
      <section>
        {/* 사진 */}
        <div className="w-full h-[53.33vw] max-h-[350px] bg-slate-100 rounded-lg overflow-hidden">
          <img
            src={`${TripReviewPic}/${item.tripReviewId}/${item.tripReviewPics?.[0]}`}
            alt={item.tripReviewPics?.[0]}
            className="w-full h-full object-cover"
          />
        </div>
        {/* 글 */}
        <div className="py-4 flex flex-col gap-4">
          <h3 className="text-lg text-slate-700 font-semibold">{item.title}</h3>
          <p className="text-base text-slate-500 line-clamp-3">
            {item.content}
          </p>
          {/* 정보 */}
          <ul className="flex items-center justify-end gap-3">
            <li className="flex items-center gap-2">
              <i className="text-slate-300 text-base">
                <BiShow />
              </i>
              <p className="text-slate-500 font-semibold text-sm">
                {item.recentCount}
              </p>
            </li>
            <li className="flex items-center gap-2">
              <i
                className={` text-base ${
                  item.likeUser ? "text-secondary3" : "text-slate-300"
                }`}
              >
                <GoThumbsup />
              </i>
              <p className="text-slate-500 font-semibold text-sm">
                {item.likeCount}
              </p>
            </li>
            <li className="flex items-center gap-2">
              <i className="text-slate-300 text-base">
                <MdOutlineContentCopy />
              </i>
              <p className="text-slate-500 font-semibold text-sm">
                {item.scrapCount}
              </p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default TripReviewItem;
