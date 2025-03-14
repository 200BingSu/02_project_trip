import { Button, DatePicker } from "antd";
import axios from "axios";
import { BiCalendar } from "react-icons/bi";
import { useRecoilState } from "recoil";
import { bookingAtom } from "../../../atoms/business-bookingAtom";
import { IAPI } from "../../../types/interface";
import { getCookie } from "../../../utils/cookie";

const FilterDate = () => {
  // 쿠키
  const accessToken = getCookie("accessToken");
  // recoil
  const [bookingData, setBookingData] = useRecoilState(bookingAtom);
  //useState

  console.log("bookingData", bookingData);
  // API 예약 목록 확인
  const getBookingList = async (): Promise<IAPI<string> | null> => {
    const url = "/api/business/my-page/booking";
    try {
      const res = await axios.get(
        `${url}?startDate=${bookingData.date[0]}&endDate=${bookingData.date[1]}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const resultData = res.data;
      console.log("예약 목록 확인", resultData);
      if (resultData) {
        setBookingData({ ...bookingData, bookingList: resultData });
      }
      return resultData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
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
  return (
    <div className="p-4 flex flex-col gap-3">
      {/* 날짜 선택 */}
      <div className="px-5 py-4 flex gap-3 border border-slate-200 rounded-lg items-center">
        <i className="text-3xl text-slate-500">
          <BiCalendar />
        </i>
        <div>
          <p className="px-3 text-sm text-slate-700">날짜 직접 선택</p>
          <DatePicker.RangePicker
            placeholder={["검색필터 시작일", "검색필터 종료일"]}
            variant="borderless"
            suffixIcon={false}
            onChange={e => {
              console.log(e);
              if (e) {
                setBookingData({
                  ...bookingData,
                  date: e.map(date => (date ? date.format("YYYY-MM-DD") : "")),
                });
              }
            }}
          />
        </div>
      </div>
      {/* 검색 버튼 */}
      <Button
        type="primary"
        className="text-xl py-1 max-h-[50px] h-[16vw]"
        onClick={getBookingList}
      >
        검색하기
      </Button>
    </div>
  );
};

export default FilterDate;
