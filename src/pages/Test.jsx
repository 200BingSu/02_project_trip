import { Button } from "antd";
import DockBar from "../components/layout/DockBar/DockBar";
import axios from "axios";
import { CONTENT, SEARCH, TRIP, USER, WISHLIST } from "../constants/api";
import { removeCookie } from "../utils/cookie";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Test = () => {
  // recoil
  const [userInfo, setUserInfo] = useRecoilState(userAtom);
  useEffect(() => {
    console.log("userInfo", userInfo);
  }, []);

  // useNavigate
  const navigate = useNavigate();
  const handleNavigateLogin = () => {
    navigate(`/signin`);
  };
  //resetToken
  const resetToken = async () => {
    try {
      const res = await axios.get("/api/user/access-token");
      console.log(res);
      setCookie("accessToken");
      setUserInfo(prev => ({
        ...prev,
        accessToken: res.data.ressulData.accessToken,
      }));
      // 원래하려던 API 다시 호출
      getMypage();
    } catch (error) {
      console.log(error);
    }
  };
  // 마이페이지 조회
  const getMypage = async () => {
    try {
      const res = await axios.get(`${USER.getUserInfo}${userInfo.userId}`, {
        headers: {
          Authorization: `Bearer ${userInfo.accessToken}`,
        },
      });
      console.log("마이페이지 조회:", res.data);
      if (res.status === 401) {
        resetToken();
      }
    } catch (error) {
      console.log("마이페이지 조회:", error);
    }
  };
  // 토큰
  const getToken = async () => {
    try {
      const res = await axios.get(`${USER.getAccessToken}`, {
        headers: {
          Authorization: `Bearer ${userInfo.accessToken}`,
        },
      });
      console.log("토큰", res.data);
    } catch (error) {
      console.log("토큰", error);
    }
  };
  // search
  const getSearch = async () => {
    // 임시 검색어
    const search_word = "대구";
    try {
      const res = await axios.get(`${SEARCH.search}${search_word}`);
    } catch (error) {
      console.log("검색:", error);
    }
  };
  // search-page
  const getSearchPage = async () => {
    // 임시 검색어
    try {
      const res = await axios.get(`${SEARCH.searchPage}`);
    } catch (error) {
      console.log("검색:", error);
    }
  };
  //상품 조회
  const getDetail = async () => {
    // 임시 아이디 부여
    const strfId = 1;
    try {
      const res = await axios.get(`${CONTENT.getDetail}${strfId}`);
      console.log("상품조회", res.data);
    } catch (error) {
      console.log("상품조회", error);
    }
  };

  //리뷰 조회
  const getReview = async () => {
    // 임시 아이디 부여
    const strfId = 1;
    try {
      const res = await axios.get(
        `/api/detail/review?strf_id=${strfId}&start_idx=0&size=20`,
      );
      console.log("리뷰조회", res.data);
    } catch (error) {
      console.log("리뷰조회", error);
    }
  };
  //트립
  const getTrip = async () => {
    const tripId = 1;
    try {
      const res = await axios.get(`${TRIP.getTrip}${tripId}`);
      console.log("trip:", res.data);
    } catch (error) {
      console.log("trip:", error);
    }
  };
  //트립/로케이션
  const getTripLocation = async () => {
    const locationId = 1;
    try {
      const res = await axios.get(`${TRIP.getTrip}${locationId}`);
      console.log("trip/location:", res.data);
    } catch (error) {
      console.log("trip/location:", error);
    }
  };
  //트립/트립 리스트
  const getTripList = async () => {
    try {
      const res = await axios.get(`${TRIP.getTripList}`, {
        headers: {
          Authorization: `Bearer ${userInfo.accessToken}`,
        },
      });
      console.log("tripList", res.data);
    } catch (error) {
      console.log("tripList", error);
    }
  };
  //위시리스트
  const getWishList = async () => {
    const category = "STAY";
    try {
      const res = await axios.get(`/api/wish-list?category=${category}&page=1`);
      console.log("위시리스트:", res.data);
    } catch (error) {
      console.log("위시리스트:", error);
    }
  };
  // 로그아웃
  const logout = () => {
    removeCookie("accessToken");
    setUserInfo({});
    handleNavigateLogin();
  };
  return (
    <div className="pb-[100px]">
      <div className="flex flex-col gap-[20px]">
        <Button type="primary" onClick={handleNavigateLogin}>
          로그인으로 이동
        </Button>
        <Button type="primary" onClick={logout}>
          로그아웃
        </Button>
        <Button type="primary" onClick={getMypage}>
          마이페이지
        </Button>
        <Button type="primary" onClick={getToken}>
          토큰
        </Button>
        <Button type="primary" onClick={getSearch}>
          검색
        </Button>
        <Button
          type="Link"
          onClick={() => {
            navigate(`/search/location`);
          }}
        >
          지역 검색
        </Button>
        <Button
          type="Link"
          onClick={() => {
            navigate(`/search/contents`);
          }}
        >
          컨텐츠 검색
        </Button>
        <Button type="primary" onClick={getSearchPage}>
          검색페이지
        </Button>
        <Button type="primary" onClick={getDetail}>
          상품조회
        </Button>
        <Button type="Link" onClick={() => navigate(`/contentspublishing`)}>
          상품 퍼블리싱
        </Button>
        {/* 숙소 */}
        <Button
          type="Link"
          onClick={() => navigate(`/contents/index?strf=STAY&strfId=82`)}
        >
          숙소 id=82
        </Button>
        <Button
          type="Link"
          onClick={() => navigate(`/contents/index?strf=RESTAUR&strfId=305`)}
        >
          음식점 id=305
        </Button>
        <Button
          type="Link"
          onClick={() => navigate(`/contents/index?strf=TOUR&strfId=58`)}
        >
          관광지 id=58
        </Button>
        <Button
          type="Link"
          onClick={() => navigate(`/contents/index?strf=FEST&strfId=829`)}
        >
          축제 id=829
        </Button>
        <Button type="primary" onClick={getReview}>
          리뷰조회
        </Button>
        <Button type="primary" onClick={getTrip}>
          트립
        </Button>
        <Button type="primary" onClick={getTripLocation}>
          트립/로케이션
        </Button>
        <Button type="primary" onClick={getTripList}>
          트립/트립 리스트
        </Button>
        <Button type="primary" onClick={getWishList}>
          위시리스트
        </Button>
      </div>
      개발 중 페이지(Index.jsx 완료 후 교체하기)
      <DockBar />
    </div>
  );
};
export default Test;
