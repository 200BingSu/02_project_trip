import { Input } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { BiBell } from "react-icons/bi";
import { CgMenuGridO } from "react-icons/cg";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";
import DockBar from "../components/layout/DockBar/DockBar";
import FestivalList from "../components/main/FestivalList";
import LocationList from "../components/main/LocationList";
import RecentList from "../components/main/RecentList";
import RecommendList from "../components/main/RecommendList";
import { getCookie, removeCookie } from "../utils/cookie";
import Footer from "./Footer";
<<<<<<< HEAD
import UserIndex from "./user/UserIndex";
=======
import UserIndex from "./userpage/user/UserIndex";
>>>>>>> socket
import jwtAxios from "../apis/jwt";

const Index = () => {
  // 쿠키
  const accessToken = getCookie("accessToken");
  const [festivities, setFestivities] = useState([]);
  const [locations, setLocations] = useState([]);
  const [recent, setRecent] = useState([]);
  const [recommend, setRecommend] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const getMainList = async () => {
    try {
      let res;
      if (accessToken) {
        res = await jwtAxios.get(`/api/home`);
      } else {
        res = await axios.get(`/api/home`);
      }
      console.log("메인", res.data.data);
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
    if (window.scrollY > 0) {
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
    // console.log("recoil", userInfo);
  }, [userInfo]);

  const HandleSearchPage = () => {
    navigate(`/search/strf`);
  };

  return (
    <div>
      <header
        className={`flex h-auto items-center px-4 py-3 max-w-3xl w-full sticky top-0 left-0 z-10 duration-300 ${scrollY ? "shadow-sm" : "shadow-none"} z-50 bg-white `}
      >
        <h1 className="w-[32vw] max-w-32 mr-auto">
          <img
            src="/images/logo_1.png"
            alt="main_logo"
            className="cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          />
        </h1>
        <nav className=" flex gap-5">
          <BiBell className="text-2xl text-slate-400 cursor-pointer" />
          <CgMenuGridO
            className="text-2xl text-slate-400 cursor-pointer"
            onClick={() => {
              if (accessToken) {
                navigate("/user/index");
              } else {
                navigate("/signin");
              }
            }}
          />
        </nav>
      </header>
      <main className="pb-10">
        <section className="px-4 mt-3">
          <Input
            className="h-auto text-sm rounded-lg  !bg-slate-100 !border-slate-300 py-[14px] px-3"
            placeholder=" 지금 어디로 여행을 떠나고 싶으신가요?"
            readOnly
            prefix={<FiSearch className="text-slate-400 text-sm" />}
            onClick={() => HandleSearchPage()}
          />
        </section>
        <section className="px-4 mt-5">
          <FestivalList festivities={festivities} />
        </section>
        <section className="px-4 mt-10">
          <LocationList locations={locations} />
        </section>
        <section className="bg-[#E8F6EF] px-4 mt-10 mx-4 h-[100px] xs:h-28 md:h-36 max-h-[140px] rounded-2xl flex items-center relative">
          <div>
            <p className="text-xs font-light text-[#4C4C6D]">
              신규회원 가입시 누구나
            </p>
            <p className="text-lg font-semibold text-[#4C4C6D]">
              최대 20만원 쿠폰팩 증정
            </p>
          </div>
          <img
            src="/images/main-banner_img.png"
            alt=""
            className="w-36 xs:w-40 md:w-42 absolute right-6 -top-5 md:!-top-7"
          />
        </section>
        <section className="px-4 mt-10">
          <RecentList
            recent={recent}
            getMainList={getMainList}
            setFestivities={setFestivities}
            setLocations={setLocations}
            setRecent={setRecent}
            setRecommend={setRecommend}
          />
        </section>
        <section className="mt-10 bg-slate-100 w-full py-16">
          <RecommendList recommend={recommend} />
        </section>
      </main>
      <Footer />
      <DockBar />
    </div>
  );
};
export default Index;
