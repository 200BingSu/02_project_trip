import { Image } from "antd";
import { ReviewPic } from "../../constants/pic";
import "../../styles/antd-styles.css";

const DynamicGrid = ({ reviewPics, type = "review" }) => {
  // reviewPics의 타입에 따라 이미지 배열 추출
  const pics =
    type === "myReview" ? reviewPics?.myReviewPic : reviewPics?.reviewPic;

  const imageCount = pics?.length;
  const displayPics = imageCount > 5 ? pics.slice(0, 5) : pics;
  const remainingCount = imageCount > 5 ? imageCount - 5 : 0;

  // 모든 이미지의 URL 생성
  const allImageUrls = pics?.map(pic =>
    type === "myReview"
      ? `${ReviewPic}/${reviewPics.reviewId}/${pic.pic}`
      : `${ReviewPic}/${reviewPics.strfId}/${pic.pic}`,
  );

  return (
    <div
      className={`custom-image grid-${Math.min(imageCount, 5)} w-full aspect-[3/2] rounded-lg overflow-hidden`}
    >
      <Image.PreviewGroup items={allImageUrls}>
        {displayPics?.map((pic, index) => {
          const imagePath = `${ReviewPic}/${reviewPics.reviewId}/${pic.pic}`;

          return (
            <Image
              key={index}
              src={imagePath}
              alt={`review-image-${index}`}
              className="!w-full !h-full !object-cover"
              {...(index === 4 && remainingCount > 0
                ? { "data-remaining": remainingCount }
                : {})}
            />
          );
        })}
      </Image.PreviewGroup>
    </div>
  );
};

export default DynamicGrid;
