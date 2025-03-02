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

//dummy data
const dummyDataRes = {
  code: "200 성공",
  data: [
    {
      bookingId: 101,
      strfId: 2001,
      strfTitle: "Cozy Apartment Downtown",
      strfPic: "https://example.com/image1.jpg",
      createdAt: "2025-02-20T12:34:56Z",
      checkInDate: "2025-03-01",
      checkOutDate: "2025-03-05",
      price: 50000,
      state: 0,
      chatRoomId: 301,
      checkInTime: "15:00",
      checkOutTime: "11:00",
    },
    {
      bookingId: 102,
      strfId: 2002,
      strfTitle: "Luxury Suite with Ocean View",
      strfPic: "https://example.com/image2.jpg",
      createdAt: "2025-02-21T15:20:10Z",
      checkInDate: "2025-03-10",
      checkOutDate: "2025-03-15",
      price: 75000,
      state: 1,
      chatRoomId: 302,
      checkInTime: "14:00",
      checkOutTime: "10:30",
    },
    {
      bookingId: 103,
      strfId: 2003,
      strfTitle: "Rustic Cabin in the Mountains",
      strfPic: "https://example.com/image3.jpg",
      createdAt: "2025-02-22T18:45:30Z",
      checkInDate: "2025-03-20",
      checkOutDate: "2025-03-25",
      price: 60000,
      state: 2,
      chatRoomId: 303,
      checkInTime: "16:00",
      checkOutTime: "12:00",
    },
  ],
};

const dummyBookingList = dummyDataRes.data;

const categoryArr = ["예약 목록", "예약 완료"];

const UserBooking = () => {
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
      const res = await jwtAxios.get(`/api/booking?page=${page}`);
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
    // getBookingList();
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
          {dummyBookingList?.map((item, index) => {
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
