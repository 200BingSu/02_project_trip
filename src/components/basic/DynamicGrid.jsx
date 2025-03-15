import { Image } from "antd";
import { ReviewPic } from "../../constants/pic";
import "../../styles/antd-styles.css";

const DynamicGrid = ({ reviewPics, type = "review" }) => {
  // reviewPics의 타입에 따라 이미지 배열 추출
  const pics =
    type === "myReview" ? reviewPics?.myReviewPic : reviewPics?.reviewPic;

  const imageCount = pics?.length;

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
      className={`custom-image grid gap-1 ${gridClass} w-full aspect-[3/2] rounded-lg overflow-hidden`}
    >
      <Image.PreviewGroup
        preview={{
          onChange: (current, prev) =>
            console.log(`current index: ${current}, prev index: ${prev}`),
        }}
      >
        {pics?.map((pic, index) => {
          let extraClass = "";
          if (imageCount === 3 && index === 0) extraClass = "row-span-2";
          if (imageCount === 5) {
            if (index === 0) extraClass = "row-span-2 col-span-2"; // 첫 번째 이미지 (2행 1열)
          }

          // 이미지 경로 생성 로직
          const imagePath =
            type === "myReview"
              ? `${ReviewPic}/${reviewPics.reviewId}/${pic.pic}`
              : `${ReviewPic}/${reviewPics.strfId}/${pic.pic}`;

          return (
            <Image
              key={index}
              src={imagePath}
              alt={`review-image-${index}`}
              className={`w-full h-full overflow-hidden object-cover ${extraClass}`}
            />
          );
        })}
      </Image.PreviewGroup>
    </div>
  );
};
export default DynamicGrid;
