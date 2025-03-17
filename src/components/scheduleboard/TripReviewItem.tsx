import { ProfilePic } from "../../constants/pic";
import { ITripReview } from "../../types/interface";
import { getCookie } from "../../utils/cookie";

interface TripReviewItemProps {
  item: ITripReview;
}

const TripReviewItem = ({ item }: TripReviewItemProps) => {
  // 쿠키
  const userInfo = getCookie("user");
  // const userId = userInfo.userId;
  const userId = 116; // 네트워크 복구되면 지우기
  return (
    <div className="flex flex-col gap-4 ">
      {/* 유저 정보 */}
      <section className="flex items-center gap-4 py-6">
        {/* 사진 */}
        <div className="w-8 aspect-square rounded-full overflow-hidden bg-slate-200">
          <img
            src={`${ProfilePic}/${userId}/${item.profilePic}`}
            alt={item.profilePic}
          />
        </div>
        {/* 이름 */}
        <p className="text-base text-slate-700 font-semibold">닉네임</p>
      </section>
      {/* 리뷰 */}
      <section>
        {/* 사진 */}
        <div className="w-full">
          <img src="" alt="" />
        </div>
        {/* 글 */}
        <div>
          <h3>제목</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa nulla
            esse assumenda facere architecto, fugiat nesciunt fugit adipisci
            iste quidem illo iure accusantium, cumque alias sequi dolore magni
            aliquam aut.
          </p>
          {/* 정보 */}
          <ul></ul>
        </div>
      </section>
    </div>
  );
};

export default TripReviewItem;
