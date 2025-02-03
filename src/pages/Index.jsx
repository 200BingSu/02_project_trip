import { Button, Input } from "antd";
import DockBar from "../components/layout/DockBar/DockBar";
import axios from "axios";
import { CONTENT, SEARCH, TRIP, USER, WISHLIST } from "../constants/api";
import { removeCookie } from "../utils/cookie";
import { useRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { Link, useNavigate } from "react-router-dom";
import { BiBell, BiLogoFacebook } from "react-icons/bi";
import { CgMenuGridO } from "react-icons/cg";
import { FiSearch } from "react-icons/fi";
import FestivalList from "../components/main/FestivalList";
import RecentList from "../components/main/RecentList";
import RecommendList from "../components/main/RecommendList";
import LocationList from "../components/main/LocationList";
import { useEffect, useState } from "react";
import { BsGooglePlay } from "react-icons/bs";
import { AiOutlineInstagram } from "react-icons/ai";
import UserIndex from "./user/UserIndex";

const Index = () => {
  const [festivities, setFestivities] = useState([]);
  const [locations, setLocations] = useState([]);
  const [recent, setRecent] = useState([]);
  const [recommend, setRecommend] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const getMainList = async () => {
    try {
      const res = await axios.get(`/api/home`, {
        headers: {
          Authorization: `Bearer ${userInfo.accessToken}`,
        },
      });
      console.log(res.data.data);
      const { festivalList, locationList, recentList, recommendList } =
        res.data.data;

      setFestivities(festivalList);
      setLocations(locationList);
      setRecent(recentList);
      setRecommend(recommendList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMainList();
  }, []);

  const handleScroll = () => {
    if (window.scrollY > 140) {
      setScrollY(true); // 스크롤이 60 이상이면 고정
    } else {
      setScrollY(false); // 스크롤이 60이면 고정 해제
    }
  };

  window.addEventListener("scroll", handleScroll);

  // recoil
  const [userInfo, setUserInfo] = useRecoilState(userAtom);
  // useNavigate
  const navigate = useNavigate();
  const handleNavigateLogin = () => {
    navigate(`/signin`);
  };

  // 로그아웃
  const logout = () => {
    removeCookie("accessToken");
    setUserInfo({});
    handleNavigateLogin();
  };

  useEffect(() => {
    console.log("recoil", userInfo);
  }, [userInfo]);

  const HandleSearchPage = () => {
    navigate(`/search/contents`);
  };

  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "unset";
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <div>
      <UserIndex isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <header
        className={`flex h-[60px] items-center px-[32px] max-w-3xl w-full duration-300 ${scrollY ? "fixed top-0 " : "relative"} z-50 bg-white `}
      >
        <h1 className="w-[160px] mr-auto">
          <img src="/images/logo_1.png" alt="main_logo" />
        </h1>
        <nav className=" flex gap-[16px]">
          <BiBell className="text-3xl text-slate-400 cursor-pointer" />
          <CgMenuGridO
            className="text-3xl text-slate-400 cursor-pointer"
            onClick={() => setIsOpen(true)}
          />
        </nav>
      </header>
      <main className="pb-[60px]">
        <section className="mx-[32px] mt-[30px]">
          <Input
            className="h-[60px] text-lg rounded-lg  !bg-slate-100 !border-slate-300  gap-[5px]"
            placeholder="지금 어디로 여행을 떠나고  싶으신가요?"
            readOnly
            prefix={<FiSearch className="text-slate-400 text-2xl" />}
            onClick={() => HandleSearchPage()}
          />
        </section>
        <section className="mx-[32px] mt-[70px]">
          <FestivalList festivities={festivities} />
        </section>
        <section className="mx-[32px] mt-[70px]">
          <LocationList locations={locations} />
        </section>
        <section className="mx-[32px] mt-[70px]">
          <img src="/images/main-banner.png" alt="" />
        </section>
        <section className="mx-[32px] mt-[70px]">
          <RecentList recent={recent} />
        </section>
        <section className="mt-[70px]">
          <RecommendList recommend={recommend} />
        </section>
      </main>
      <footer className="relative py-10  before:absolute before:top-0 before:w-full before:h-2.5 before:bg-slate-100 before:inline-block">
        <div className="flex gap-4 text-xl font-bold text-slate-600 mb-5 px-8">
          <Link to="">이용약관</Link>
          <span className="text-slate-300 font-light">|</span>
          <Link to="">개인정보처리방침</Link>
          <span className="text-slate-300 font-light">|</span>
          <Link to="">서비스 이용약관</Link>
          <span className="text-slate-300 font-light">|</span>
          <Link to="">위치서비스 이용약관</Link>
        </div>
        <div className="px-8">
          <div className="flex items-center justify-between ">
            <h4 className="text-lg font-bold text-slate-600">(주) 쿼드러플</h4>
            <div className="flex gap-3">
              <Link
                to=""
                className="flex justify-center items-center w-9 h-9 rounded-full border border-slate-300"
              >
                <BiLogoFacebook className="text-slate-400 text-xl" />
              </Link>
              <Link
                to=""
                className="flex justify-center items-center w-9 h-9 rounded-full border border-slate-300"
              >
                <AiOutlineInstagram className="text-slate-400 text-xl" />
              </Link>
              <Link
                to=""
                className="flex justify-center items-center w-9 h-9 rounded-full border border-slate-300"
              >
                <BsGooglePlay className="text-slate-400 text-lg" />
              </Link>
            </div>
          </div>
          <div className="text-lg text-slate-400 font-normal leading-6 mt-5">
            <p>서울특별시 강남구 테헤란로 123, 45층</p>
            <p>사업자 등록번호 123-45-67890</p>
            <p>통신판매업 신고번호: 2025-서울강남-01234</p>
            <p>이메일: support@quadruple.app</p>
          </div>
          <div className="text-base font-light text-slate-400 mt-3">
            <p>여행지 및 콘텐츠 정보는 공공데이터를 기반으로 제작되었습니다.</p>
            <p>© 2025 쿼드러플. All rights reserved.</p>
          </div>
          <img
            src="/images/logo_2.png"
            alt="footer-main-logo"
            className="w-32 mt-5"
          />
        </div>
      </footer>
      <DockBar />
    </div>
  );
};
export default Index;
