import { Button, Input } from "antd";
import DockBar from "../components/layout/DockBar/DockBar";
import axios from "axios";
import { CONTENT, SEARCH, TRIP, USER, WISHLIST } from "../constants/api";
import { removeCookie } from "../utils/cookie";
import { useRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";
import { BiBell } from "react-icons/bi";
import { CgMenuGridO } from "react-icons/cg";
import { FiSearch } from "react-icons/fi";
import FestivalList from "../components/main/FestivalList";
import RecentList from "../components/main/RecentList";
import RecommendList from "../components/main/RecommendList";
import LocationList from "../components/main/LocationList";
import { useEffect, useState } from "react";

const Index = () => {
  const [festivities, setFestivities] = useState([]);
  const [locations, setLocations] = useState([]);
  const [recommend, setRecommend] = useState([]);

  const getMainList = async () => {
    try {
      const res = await axios.get(`/api/home`, {
        headers: {
          // Authorization: `Bearer ${userInfo.accessToken}`,
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJncmVlbkBncmVlbi5rciIsImlhdCI6MTczODMwNTI4MiwiZXhwIjoxNzM4MzI2ODgyLCJzaWduZWRVc2VySWQiOiJ7XCJzaWduZWRVc2VySWRcIjoxMTIsXCJyb2xlc1wiOltcIlVTRVJcIixcIkFETUlOXCIsXCJCVUlTXCJdfSJ9.S4HINLa2BF7oYRHDnr5GZKCeP4_w1LrpAldSZtdeq8bZqHh4Lw7jivXWy4gk-kmJsIh7WgHHyBi7nXMVL3QOwg`,
        },
      });
      console.log(res.data.data);
      const { festivalList, locationList, recommendList } = res.data.data;

      setFestivities(festivalList);
      setLocations(locationList);
      setRecommend(recommendList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMainList();
  }, []);

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
    navigate(`/search`);
  };
  return (
    <div>
      <header className="flex h-[60px] items-center mx-[32px]">
        <h1 className="w-[160px] mr-auto">
          <img src="/images/logo_1.png" alt="main_logo" />
        </h1>
        <nav className=" flex gap-[16px]">
          <BiBell className="text-3xl text-slate-400 cursor-pointer" />
          <CgMenuGridO className="text-3xl text-slate-400 cursor-pointer" />
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
          <RecommendList recommend={recommend} />
        </section>
      </main>
      <footer></footer>
      <DockBar />
    </div>
  );
};
export default Index;
