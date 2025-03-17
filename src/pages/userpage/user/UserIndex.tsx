import axios from "axios";
import { useEffect, useState } from "react";
import { AiFillSetting, AiOutlineHeart, AiOutlineStar } from "react-icons/ai";
import { BiBell, BiCoin, BiShow, BiSolidCoupon } from "react-icons/bi";
import { GoDiscussionOutdated } from "react-icons/go";
import { HiOutlineMap } from "react-icons/hi2";
import { IoIosArrowForward } from "react-icons/io";
import { IoCloseSharp, IoReaderOutline } from "react-icons/io5";
import { RxExit } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilValue, useResetRecoilState } from "recoil";
// import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { LocationPic, ProfilePic } from "../../../constants/pic";
import { getCookie, removeCookie, setCookie } from "../../../utils/cookie";

import { tsUserAtom } from "../../../atoms/tsuserAtom";
import { resetUserData } from "../../../selectors/userSelector";
import { ProviderType, ROLE } from "../../../types/enum";
import { IAPI } from "../../../types/interface";

//interface
interface ITripList {
  tripId: number;
  locationPic: string;
  title: string;
  dday: number;
}
interface IGetUserData {
  name: string;
  profilePic: string;
  couponCnt: number;
  tripList: ITripList[];
}
interface IGetUsrInfo {
  code: string;
  data: IGetUserData;
}

const UserIndex = () => {
  //recoil
  const userInfo = useRecoilValue(tsUserAtom);
  const resetUserInfo = useResetRecoilState(resetUserData);

  const [useProfile, setUseProfile] = useState<IGetUserData>({
    name: "",
    couponCnt: 0,
    profilePic: "",
    tripList: [],
  });
  // const [coupon, setCoupon] = useState("");

  const accessToken = getCookie("accessToken");
  const userLogin = getCookie("user");

  const getUserInfo = async (): Promise<IGetUsrInfo | null> => {
    try {
      const res = await axios.get<IGetUsrInfo>(`/api/home/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const resultData = res.data;
      setUseProfile(resultData.data);
      return resultData;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  // API 관리자 채팅방 생성
  const createChatToAdmine = async (): Promise<IAPI<
    string | number
  > | null> => {
    const url = "/api/chat-room/admin";
    try {
      const res = await axios.post<IAPI<string | number>>(url, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("관리자 채팅방 생성", res.data);
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        navigateToChatRoom(resultData.data);
      }
      return resultData;
    } catch (error) {
      console.log("관리자 채팅방 생성", error);
      return null;
    }
  };
  useEffect(() => {
    if (accessToken) {
      getUserInfo();
    }
  }, []);

  const navigate = useNavigate();
  const navigateToChatRoom = (roomId: string | number) => {
    navigate(`/chatroom?roomId=${roomId}`);
  };
  const handleLogout = () => {
    resetUserInfo();
    removeCookie("accessToken");
    const userInfo = getCookie("user");
    if (userInfo.isSaveEmail === false) {
      setCookie("user", { ...userInfo, email: "" });
    }
    if (userInfo.isSaveLogin === false) {
      setCookie("user", {
        ...userInfo,
        userId: "",
        email: "",
        accessToken: "",
        role: [ROLE.GUEST],
      });
    }

    navigate("/signin");
  };

  const handleUserEdit = () => {
    navigate("/user/useredit", { state: useProfile });
  };

  return (
    <div className={` w-full flex justify-end`}>
      {/* 모바일 메뉴 컨테이너 */}
      <div
        className={`w-full h-screen bg-white `}
        onClick={e => e.stopPropagation()}
      >
        <div className="px-4">
          <div className="flex justify-between py-[14px]">
            <IoCloseSharp
              onClick={() => navigate("/")}
              className="text-3xl cursor-pointer text-slate-700"
            />
            <h1 className="flex gap-5">
              <BiBell
                onClick={() => navigate("/user/notification")}
                className="text-3xl text-slate-700 cursor-pointer"
              />
              <AiFillSetting
                className="text-3xl text-slate-700 cursor-pointer"
                onClick={() => handleUserEdit()}
              />
            </h1>
          </div>
          <div>
            <div className="mt-5">
              <div className="mx-auto w-32 h-32 rounded-full overflow-hidden">
                <img
                  src={
                    userInfo.providerType === ProviderType.LOCAL
                      ? userInfo.profilePic
                        ? `${ProfilePic}/${userLogin?.userId}/${userInfo?.profilePic}`
                        : `/images/user.png`
                      : userInfo.profilePic
                        ? `${userInfo.profilePic}`
                        : `/images/user.png`
                  }
                  alt="User-Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <h1 className="text-2xl font-bold text-slate-700 mt-[14px] text-center">
                {userInfo.name}
              </h1>
              <Swiper slidesPerView={1} className="mySwiper">
                {useProfile.tripList?.map(content => (
                  <SwiperSlide key={content.tripId}>
                    <div
                      className="flex items-center justify-between bg-slate-100 mt-5 px-4 py-4 rounded-full relative
                    after:absolute after:border-solid after:border-transparent after:border-b-slate-100 after:border-x-[16px] after:border-b-[30px] after:-top-4 after:left-1/2 after:-translate-x-1/2"
                    >
                      <div className="flex items-center">
                        <img
                          src={`${LocationPic}/${content.locationPic}`}
                          alt=""
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <span className="text-lg text-slate-700 font-normal">
                          {content.title}
                        </span>
                      </div>
                      <span className="text-lg text-primary font-semibold">
                        {content.dday > 0 ? `D-${content.dday}` : "여행중"}
                      </span>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="flex my-5">
              <Link
                to="/user/usertrips"
                className="w-1/4 text-center text-base text-slate-500 font-normal relative after:absolute after:top-1/2 after:-translate-y-1/2 after:right-0 after: after:bg-slate-200 after:w-[1px] after:h-14"
              >
                <HiOutlineMap className="w-full text-3xl text-slate-700 mb-2" />
                여행
              </Link>
              <Link
                to="/user/userwishlist"
                className="w-1/4 text-center text-base text-slate-500 font-normal relative after:absolute after:top-1/2 after:-translate-y-1/2 after:right-0 after: after:bg-slate-200 after:w-[1px] after:h-14"
              >
                <AiOutlineHeart className="w-full text-3xl text-slate-700 mb-2" />
                찜하기
              </Link>
              <Link
                to="/user/userreview"
                className="w-1/4 text-center text-base text-slate-500 font-normal relative after:absolute after:top-1/2 after:-translate-y-1/2 after:right-0 after: after:bg-slate-200 after:w-[1px] after:h-14"
              >
                <AiOutlineStar className="w-full text-3xl text-slate-700 mb-2" />
                리뷰
              </Link>
              <Link
                to="/user/usertrip"
                className="w-1/4 text-center text-base text-slate-500 font-normal"
              >
                <IoReaderOutline className="w-full text-3xl text-slate-700 mb-2" />
                내 여행기
              </Link>
            </div>
          </div>
        </div>
        <p className="w-full h-[10px] bg-slate-100"></p>
        <div className="w-full px-4">
          <Link
            to="/user/userbooking"
            className="flex items-center py-5 text-xl text-slate-700 font-normal"
          >
            <GoDiscussionOutdated className="text-3xl text-slate-400 mr-4" />
            내예약
            <IoIosArrowForward className="text-slate-300 ml-auto" />
          </Link>
          <Link
            to="/user/usercoupon"
            className="flex items-center py-5 text-xl text-slate-700 font-normal"
          >
            <BiSolidCoupon className="text-3xl text-slate-400 mr-4" />
            쿠폰함
            {useProfile.couponCnt > 0 && (
              <span className="ml-auto w-9 h-6 rounded-2xl text-sm text-center leading-[1.45rem] text-primary3 bg-[#A5EEFE]/50">
                {useProfile.couponCnt}
              </span>
            )}
            <IoIosArrowForward className="text-slate-300 ml-2" />
          </Link>
          <Link
            to="/user/point"
            className="flex items-center py-5 text-xl text-slate-700 font-normal"
          >
            <BiCoin className="text-3xl text-slate-400 mr-4" />
            포인트
            <IoIosArrowForward className="text-slate-300 ml-auto" />
          </Link>
          <Link
            to="/user/recentlist"
            className="flex items-center py-5 text-xl text-slate-700 font-normal"
          >
            <BiShow className="text-3xl text-slate-400 mr-4" />
            최근 본 목록
            <IoIosArrowForward className="text-slate-300 ml-auto" />
          </Link>
        </div>
        <p className="w-full h-[10px] bg-slate-100"></p>
        <div className="px-4 pb-[130px]">
          <Link to="" className="flex py-5  text-slate-500 text-sm">
            공지사항
          </Link>
          <Link to="" className="flex  text-slate-500 py-5 text-sm">
            FAQ
          </Link>
          <Link to="" className="flex   text-slate-500 py-5 text-sm">
            고객센터
          </Link>
          <div
            className="flex text-slate-500 py-5 text-sm cursor-pointer"
            onClick={createChatToAdmine}
          >
            1:1 문의하기
          </div>
          <Link
            to="/user/changepw"
            className="flex text-slate-500 py-5 text-sm"
          >
            비밀번호 변경
          </Link>
          {accessToken && (
            <p
              onClick={() => handleLogout()}
              className="flex gap-3 items-center text-slate-500 py-5 text-sm"
            >
              <RxExit className="text-slate-300" />
              로그아웃
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
export default UserIndex;
