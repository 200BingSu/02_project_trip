/**
 * API 정리용 상수
 *
 * @example
 * const email = "example@test.com";
 * const res = await axios.get(`${API.USER.SIGN_UP.GET}${email}`);
 */
export const USER = {
  signUpUser: "/api/user/sign-up",
  checkDuplicatedEmail: "/api/user/sign-up?email=",
  sendMail: "/api/mail?email=",
  checkMail: "/api/mail",
  resetPassword: "/api/user/reset-password",
  signInUser: "/api/user/sign-in",
  signInBusiness: "/api/busi/sign-in",
  getAccessToken: "/api/user/access-token",
  getUserInfo: "/api/user/userInfo?userId=",
  patchUser: "/api/user",
};

export const CONTENT = {
  getDetail: "/api/detail?strfId=",
  getReview: "/api/detail/review?strf_id=1&start_idx=0&size=20",
  postBooking: "/api/booking",
  getBookingList: "/api/booking",
  getBooking: "/api/booking?booking_id=1",
};

export const WISHLIST = {
  postWishList: "/api/wish-list",
  getWishList: "/api/wish-list?category=%22STAY%22&page=1",
};

export const SEARCH = {
  search: "/api/search",
  searchPage: "/api/search-page",
  searchList: "/api/search/list",
};

export const TRIP = {
  getTripList: "/api/trip-list",
  getLocationList: "/api/trip/location?location_id=",
  postTrip: "/api/trip",
  getTrip: "/api/trip?trip_id=",
  transportGet: "/api/transport/get",
  postSchedule: "/api/schedule",
  deleteSchedule: "/api/schedule",
  patchSeq: "/api/schedule/seq",
  deleteTripUser: "/api/trip/user",
};

export const MEMO = {
  selectMemo: "/api/memo/select",
  postMemo: "/api/memo/post",
  patchMemo: "/api/memo/upd",
  deleteMemo: "/api/memo/delete",
};

export const MAIN = {
  getHome: "/api/home",
  myPage: "/api/home/user",
};

export const REVIEW = {
  getMyReviews: "/api/my_reviews",
  postReview: "/api/review",
  postRating: "/api/reveiw",
  patchReview: "/api/review",
};

export const SCRAP = {
  postScrap: "/api/scrap",
  getScrap: "/api/scrap",
};

export const COUPON = {
  postCoupon: "/api/coupon",
  getCoupon: "/api/coupon",
};

export const ACCOUNT = {
  getAccount: "/api/account/get",
  postAccount: "/api/account/post",
  selectAccount: "/api/account/select",
  deleteAccount: "/api/account/delete",
};

export const PRODUCT = {
  getProduct: "/api/product/get",
};

export const WEATHER = {
  getWeather: "/api/weather/get",
};

export const ALARM = {
  userImminent: "/api/user/imminent",
  userAlarm: "/api/user/alarm",
};

export const BOOKING = {
  getBooking: "/api/booking?checkIn=string&checkOut=string&finalPayment=0",
};
