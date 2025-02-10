import axios from "axios";
import { useEffect, useState } from "react";
import { AiFillSetting, AiOutlineHeart, AiOutlineStar } from "react-icons/ai";
import { BiBell, BiShow, BiSolidCoupon } from "react-icons/bi";
import { BsCashStack } from "react-icons/bs";
import { GoDiscussionOutdated } from "react-icons/go";
import { HiOutlineMap } from "react-icons/hi2";
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoCloseSharp, IoReaderOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userAtom } from "../../atoms/userAtom";
import { LocationPic, ProfilePic } from "../../constants/pic";
import { getCookie, removeCookie } from "../../utils/cookie";
import UserRecentList from "./UserRecentList";
import UserTrips from "./UserTrips";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const UserIndex = ({ isOpen, onClose }) => {
  const [userInfo, setUserInfo] = useRecoilState(userAtom);
  const [useProfile, setUseProfile] = useState([]);
  const [coupon, setCoupon] = useState("");

  const accessToken = getCookie("accessToken");

  const getUserInfo = async () => {
    try {
      const res = await axios.get(`/api/home/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("✅  getUserInfo  res.data.data:", res.data.data);
      setUseProfile(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCoupon = async () => {
    try {
      const res = await axios.get(`/api/coupon/available-coupons`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("✅  getCoupon  res.data.data:", res.data.data);
      setCoupon(res.data.data);
    } catch (error) {
      console.log("✅  getCoupon  error:", error);
    }
  };

  useEffect(() => {
    if (userInfo.accessToken) {
      getUserInfo();
      getCoupon();
    }
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    setUserInfo({
      userId: 0,
      accessToken: "",
    });
    removeCookie("accessToken");
    navigate("/signin");
  };

  const handleUserEdit = () => {
    navigate("user/useredit", { state: useProfile });
  };

  return (
    <div
      className={`overflow-hidden max-w-3xl w-full fixed left-1/2 -translate-x-1/2 inset-0 z-[99] flex justify-end transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={() => onClose()}
    >
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black opacity-50 "
        onClick={() => onClose()}
      ></div>
      {/* 모바일 메뉴 컨테이너 */}
      <div
        className={`z-[999] absolute top-0 right-0 w-[70%]  h-screen bg-white overflow-y-auto shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : " translate-x-full"
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="px-8 py-8">
          <div className="flex justify-between">
            <IoCloseSharp
              onClick={() => onClose()}
              className="text-3xl cursor-pointer text-slate-700"
            />
            <h1 className="flex gap-5">
              <BiBell className="text-3xl text-slate-700 cursor-pointer" />
              <AiFillSetting
                className="text-3xl text-slate-700 cursor-pointer"
                onClick={() => handleUserEdit()}
              />
            </h1>
          </div>
          <div>
            {userInfo.accessToken ? (
              <div className="">
                <div className="mx-auto w-32 h-32 rounded-full overflow-hidden">
                  <img
                    src={
                      useProfile.profilePic
                        ? `${ProfilePic}${userInfo?.userId}/${useProfile?.profilePic}`
                        : `/images/user.png`
                    }
                    alt="User-Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <h1 className="text-3xl font-bold text-slate-700 mt-4 text-center">
                  {useProfile.name}
                </h1>
                <Swiper slidesPerView={1} className="mySwiper">
                  {useProfile.tripList?.map(content => (
                    <SwiperSlide key={content.tripId}>
                      <span className="absolute top-0 left-1/2 -translate-x-1/2 block w-0 h-0 border-transparent border-solid border-l-[12px] border-r-[12px] border-b-[20px] border-b-slate-100 z-[1]" />
                      <div className="flex items-center justify-between bg-slate-100 mt-5 px-5 h-20 rounded-[36px] relative">
                        <div className="flex items-center">
                          <img
                            src={`${LocationPic}${content.locationPic}`}
                            alt=""
                            className="w-8 h-8 rounded-full mr-3"
                          />
                          <span className="text-xl text-slate-700 font-normal">
                            {content.title}
                          </span>
                        </div>
                        <span className="text-xl text-primary font-medium">
                          {content.dday > 0 ? `D-${content.dday}` : "여행중"}
                        </span>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              <Link
                to="/signin"
                className="text-2xl font-bold text-slate-700 flex items-center justify-between py-5"
              >
                <span>로그인 해주세요</span>
                <IoIosArrowRoundForward className="text-3xl" />
              </Link>
            )}

            <div className="flex mt-10">
              <Link
                to="/user/usertrips"
                className="w-1/4 text-center text-lg text-slate-500 font-normal relative after:absolute after:top-1/2 after:-translate-y-1/2 after:right-0 after: after:bg-slate-200 after:w-[1px] after:h-14"
              >
                <HiOutlineMap className="w-full text-4xl text-slate-700 mb-2" />
                여행
              </Link>
              <Link
                to="/user/userwishlist"
                className="w-1/4 text-center text-lg text-slate-500 font-normal relative after:absolute after:top-1/2 after:-translate-y-1/2 after:right-0 after: after:bg-slate-200 after:w-[1px] after:h-14"
              >
                <AiOutlineHeart className="w-full text-4xl text-slate-700 mb-2" />
                찜하기
              </Link>
              <Link
                to="/user/userreview"
                className="w-1/4 text-center text-lg text-slate-500 font-normal relative after:absolute after:top-1/2 after:-translate-y-1/2 after:right-0 after: after:bg-slate-200 after:w-[1px] after:h-14"
              >
                <AiOutlineStar className="w-full text-4xl text-slate-700 mb-2" />
                리뷰
              </Link>
              <Link
                to="/user/usertrip"
                className="w-1/4 text-center text-lg text-slate-500 font-normal"
              >
                <IoReaderOutline className="w-full text-4xl text-slate-700 mb-2" />
                내 여행기
              </Link>
            </div>
          </div>
        </div>
        <p className="w-full h-[10px] bg-slate-100"></p>
        <div className="w-full px-8 py-8">
          <Link
            to="/user/userbooking"
            className="flex items-center py-5 text-2xl text-slate-700 font-normal"
          >
            <GoDiscussionOutdated className="text-4xl text-slate-400 mr-4" />
            내예약
          </Link>
          <Link
            to="/user/usercoupon"
            className="flex items-center py-5 text-2xl text-slate-700 font-normal"
          >
            <BiSolidCoupon className="text-4xl text-slate-400 mr-4" />
            쿠폰함
            {coupon.availableCouponCount > 0 && (
              <span className="ml-auto w-9 h-6 rounded-2xl text-sm text-center leading-[1.45rem] text-primary3 bg-[#A5EEFE]/50">
                {coupon.availableCouponCount}
              </span>
            )}
          </Link>
          {/* <Link
            to=""
            className="flex items-center py-5 text-2xl text-slate-700 font-normal"
          >
            <BsCashStack className="text-4xl text-slate-400 mr-4" />
            지역 상품권
          </Link> */}
          <Link
            to="/user/recentlist"
            className="flex items-center py-5 text-2xl text-slate-700 font-normal"
          >
            <BiShow className="text-4xl text-slate-400 mr-4" />
            최근 본 목록
          </Link>
        </div>
        <p className="w-full h-[10px] bg-slate-100"></p>
        <div className="px-8 pb-8">
          <Link to="" className="flex py-5 text-lg text-slate-500">
            공지사항
          </Link>
          <Link to="" className="flex text-lg text-slate-500 py-5">
            자주 묻는 질문
          </Link>
          <Link to="" className="flex  text-lg text-slate-500 py-5">
            고객센터
          </Link>
          {userInfo.accessToken && (
            <button
              onClick={() => handleLogout()}
              className="w-full h-[60px] rounded-lg border border-slate-300 text-2xl font-bold text-slate-500"
            >
              로그아웃
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default UserIndex;
