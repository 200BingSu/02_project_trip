import { Spin } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { bookingAtom } from "../../../atoms/business-bookingAtom";
import BookingList from "../../../components/business/booking/BookingList";
import FilterDate from "../../../components/business/booking/FilterDate";
import NoData from "../../../components/common/NoData";
import { IAPI } from "../../../types/interface";
import { getCookie } from "../../../utils/cookie";

const BookindIndex = (): JSX.Element => {
  // 쿠키
  const accessToken = getCookie("accessToken");
  // recoil
  const [bookingData, setBookingData] = useRecoilState(bookingAtom);

  // useState
  const [isLoading, setIsLoading] = useState(false);

  // API 예약 목록 확인
  const getBookingList = async (): Promise<IAPI<string> | null> => {
    const url = "/api/business/my-page/booking";
    setIsLoading(true);
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const resultData = res.data;
      console.log("예약 목록 확인", resultData);
      if (resultData) {
        setIsLoading(false);
        setBookingData({ ...bookingData, bookingList: resultData });
      }
      return resultData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setIsLoading(false);
        if (error.response?.status === 404) {
          console.log("404 정보 없음", error.response.data);
          setBookingData({ ...bookingData, bookingList: [] });
        } else {
          console.log("예약 목록 확인", error);
        }
      }
      return null;
    }
  };

  useEffect(() => {
    getBookingList();
    // setBookingData({ ...bookingData, bookingList: bookingMock });
  }, []);

  return (
    <div>
      <FilterDate />
      <Spin spinning={isLoading}>
        {bookingData.bookingList.length === 0 && (
          <NoData content="예약이 없습니다" />
        )}
        {bookingData.bookingList.length > 0 &&
          bookingData.bookingList.map((item, index) => {
            return <BookingList key={index} item={item} />;
          })}
      </Spin>
    </div>
  );
};

export default BookindIndex;
