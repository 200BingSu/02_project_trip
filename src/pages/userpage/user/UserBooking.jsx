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

const categoryArr = ["예약 목록", "예약 완료"];

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
    <div className="flex flex-col gap-[30px]">
      <TitleHeader icon="back" title="내 예약" onClick={navigateBack} />
      <div className="flex flex-col gap-[20px] w-full">
        {/* 카테고리 버튼 */}
        <div>
          <ul className="flex gap-6 w-full border-b border-slate-200 px-[32px]">
            {categoryArr.map((item, index) => {
              return (
                <li
                  key={index}
                  onClick={() => setCategory(index)}
                  className={`flex justify-center items-center 
                  pt-[17px] pb-[16px]
                  text-lg cursor-pointer
                  border-b-[2px] transition-all duration-300 ease-in-out
                  ${index === category ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-primary"}`}
                >
                  {item}
                </li>
              );
            })}
          </ul>
        </div>

        {/* 내용 */}
        <div className="min-h-[500px] flex flex-col justify-center items-center">
          {bookingList?.map((item, index) => {
            return <Bookings key={index} data={item} />;
          })}
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
