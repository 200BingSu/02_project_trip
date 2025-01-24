import { Button } from "antd";
import DockBar from "../components/layout/DockBar/DockBar";
import axios from "axios";
import { CONTENT, SEARCH, TRIP, USER, WISHLIST } from "../constants/api";
import { removeCookie } from "../utils/cookie";
import { useRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";

const Test = () => {
  // recoil
  const [userInfo, setUserInfo] = useRecoilState(userAtom);
  // useNavigate
  const navigate = useNavigate();
  const handleNavigateLogin = () => {
    navigate(`/signin`);
  };
  // 마이페이지 조회
  const getMypage = async () => {
    try {
      const res = await axios.get(`${USER.getUserInfo}${userId}`);
      console.log("마이페이지 조회:", res.data);
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
    <div>
      메인화면
      <DockBar />
    </div>
  );
};
export default Test;
