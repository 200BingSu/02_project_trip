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
import UserIndex from "./user/UserIndex";
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
    // console.log("recoil", userInfo);
  }, [userInfo]);

  const HandleSearchPage = () => {
    navigate(`/search/strf`);
  };

  return (
    <div>
      <UserIndex isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <header
        className={`flex h-[60px] items-center px-[32px] max-w-3xl w-full duration-300 ${scrollY ? "fixed top-0 " : "relative"} z-50 bg-white `}
      >
        <h1 className="w-[160px] mr-auto">
          <img
            src="/images/logo_1.png"
            alt="main_logo"
            className="cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          />
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
          <RecentList
            recent={recent}
            getMainList={getMainList}
            setFestivities={setFestivities}
            setLocations={setLocations}
            setRecent={setRecent}
            setRecommend={setRecommend}
          />
        </section>
        <section className="mt-[70px]">
          <RecommendList recommend={recommend} />
        </section>
      </main>
      <Footer />
    </div>
  );
};
export default Index;
