/**
 * ## 프로필 사진
 * 뒤에 userId 필요
 * 예시: http://112.222.157.157:5214/pic/user/${userId}/1.jpg
 * 사용: `${ProfilePic}/${userId}/1.jpg`
 */
export const ProfilePic = "http://112.222.157.157:5231/pic/user";

/**
 * ## 상품 사진
 * 뒤에 strfId 필요
 * 예시: http://112.222.157.157:5231/pic/strf/${strfId}/1.jpg
 * 사용: `${ProductPic}/${strfId}/1.jpg`
 */
export const ProductPic = "http://112.222.157.157:5231/pic/strf";

/**
 * ## 메뉴 사진
 * 뒤에 strfId/menuId 필요
 * 예시: http://112.222.157.157:5231/pic/strf/${strfId}/menu/1.jpg
 * 사용: `${MenuPic}/${strfId}/menu/1.jpg`
 */
export const MenuPic = "http://112.222.157.157:5231/pic/strf";

/**
 * ## 지역 사진
 * 예시: http://112.222.157.157:5231/pic/location/1.jpg
 * 사용: `${LocationPic}/1.jpg`
 */
export const LocationPic = "http://112.222.157.157:5231/pic/location";

/**
 * ## 리뷰 사진
 *뒤에 reviewId 필요
 * 예시: http://112.222.157.157:5231/pic/reviewId/${reviewId}/1.jpg
 * 사용: `${ReviewPic}/${reviewId}/1.jpg`
 */
export const ReviewPic = "http://112.222.157.157:5231/pic/reviewId";

/**
 * ## 여행기 사진
 *뒤에 reviewId 필요
 * 예시: "http://112.222.157.157:5231/pic/tripReview/${trip_review_id}/1.jpg
 * 사용: `${TripReviewPic}/${trip_review_id}/1.jpg`
 */
export const TripReviewPic = "http://112.222.157.157:5231/pic/tripReview";
