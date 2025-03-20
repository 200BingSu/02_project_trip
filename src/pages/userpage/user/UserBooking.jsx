import { useCallback, useEffect, useState } from "react";
import TitleHeader from "../../../components/layout/header/TitleHeader";
import { useNavigate } from "react-router-dom";
import jwtAxios from "../../../apis/jwt";
import { userAtom } from "../../../atoms/userAtom";
import Loading from "../../../components/loading/Loading";
import { useRecoilValue } from "recoil";
import { LiaComment } from "react-icons/lia";
import Footer from "../../Footer";
import Bookings from "../../../components/user/Bookings";
import axios from "axios";
import { getCookie } from "../../../utils/cookie";
import { Tabs } from "antd";
import "../../../styles/antd-styles.css";

const UserBooking = () => {
  // 쿠키
  const accessToken = getCookie("accessToken");
  //recoil
  const { userId } = useRecoilValue(userAtom);
  // useNavigate
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate(-1);
  };
  //useState
  const [category, setCategory] = useState(0);
  const [bookingList, setBookingList] = useState([]);
  const [beforeList, setBeforeList] = useState([]);
  const [afterList, setAfterList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);

  // 예약 목록 불러오기
  const getBookingList = useCallback(async () => {
    try {
      const res = await axios.get(`/api/booking?page=${page}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("예약 목록", res.data);
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        setBookingList(resultData.data);
      }
      // setBeforeList(resultData.data.beforeList);
      // setAfterList(resultData.data.afterList);
    } catch (error) {
      console.log("예약 목록 불러오기 실패", error);
    }
  }, []);

  useEffect(() => {
    getBookingList();
  }, []);

  return (
    <div className="flex flex-col">
      <TitleHeader icon="back" title="내 예약" onClick={navigateBack} />
      <div className="flex flex-col w-full">
        {/* 카테고리 버튼 */}
        <div>
          <Tabs
            className="custom-tabs-nav custom-tabs-coupon"
            defaultActiveKey="1"
            items={[
              {
                label: "예약 목록",
                key: "1",
                children: (
                  <>
                    {bookingList
                      ?.filter(item => item.state === 0 || item.state === 1) // state가 0 또는 1인 경우만 필터링
                      .map((item, index) => (
                        <Bookings key={index} data={item} />
                      ))}
                  </>
                ),
              },
              {
                label: "예약 완료",
                key: "2",
                children: (
                  <>
                    {bookingList
                      ?.filter(item => item.state === 2 || item.state === 3) // state가 0 또는 1인 경우만 필터링
                      .map((item, index) => (
                        <Bookings key={index} data={item} />
                      ))}
                  </>
                ),
              },
            ]}
          />
        </div>

        {/* 내용 */}
        <div className="flex flex-col justify-center items-center">
          {/* {bookingList?.map((item, index) => {
            return <Bookings key={index} data={item} />;
          })} */}
          {/* {category === 0 ? (
                beforeList.length > 0 ? (
                  <div>
                    {beforeList.map((item, index) => {
                      return <Bookings key={index} />;
                    })}
                  </div>
                ) : (
                  <>
                    <i className="text-slate-300 text-[100px]">
                      <LiaComment />
                    </i>
                    <p className="text-slate-400 text-[20px]">
                      예약 내역이 없습니다.
                    </p>
                  </>
                )
              ) : null}
              {category === 1 ? (
                afterList.length > 0 ? (
                  <div>
                    {afterList.map((item, index) => {
                      return <Bookings key={index} />;
                    })}
                  </div>
                ) : (
                  <div>
                    <i className="text-slate-300 text-[100px]">
                      <LiaComment />
                    </i>
                    <p className="text-slate-400 text-[20px]">
                      예약 내역이 없습니다.
                    </p>
                  </div>
                )
              ) : null} */}
        </div>

        {/* 푸터 */}
        <Footer />
      </div>
    </div>
  );
};
export default UserBooking;
