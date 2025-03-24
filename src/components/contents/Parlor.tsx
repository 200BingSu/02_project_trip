import { Button, DatePicker, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useState, useEffect } from "react";
import { BiTime } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import jwtAxios from "../../apis/jwt";
import { MenuPic } from "../../constants/pic";
import "../../styles/antd-styles.css";
import { MenuType } from "../../types/interface";

const { RangePicker } = DatePicker;

interface inquiryCheck {
  menuId: number;
  check: boolean;
}

interface roomProps {
  maxCapacity: number;
  recomCapacity: number;
  surcharge: number;
  title?: string | null;
  menuId: string;
  roomId: number;
  roomNum: number[];
}

const Parlor = ({
  strfId,
  menuData,
  contentData,
}: {
  strfId: number;
  menuData: MenuType[];
  contentData: any;
  getMenuDetail: () => Promise<void>;
}) => {
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState<inquiryCheck[]>([]);
  const [isRoom, setIsRoom] = useState<roomProps[]>([]);
  const [selectedDates, setSelectedDates] = useState<[string, string] | null>(
    null,
  );
  const [quantity] = useState(1);
  const [, setRefresh] = useState({});

  const getRsrvtInquiry = async (start: string, end: string) => {
    try {
      const res = await jwtAxios.get(
        `/api/detail/check?strfId=${strfId}&checkIn=${start}&checkOut=${end}`,
      );
      if (res.data) {
        console.log("예약 조회 응답:", res.data);
        setInquiry(res.data);
        setRefresh({});
      }
    } catch (error) {
      console.log("예약 조회 에러:", error);
      setInquiry([]);
    }
  };

  useEffect(() => {
    console.log("inquiry 상태 변경됨:", inquiry);
    setRefresh({});
  }, [inquiry]);

  const getRoom = async () => {
    try {
      const res = await jwtAxios.get(
        `/api/detail/parlor?strf_id=${strfId}&category=숙소`,
      );
      if (res.data?.data) {
        setIsRoom(res.data.data);
      }
      console.log("예약 가능 여부:", res.data);
    } catch (error) {
      console.log("예약 조회 에러:", error);
      setInquiry([]);
    }
  };

  useEffect(() => {
    getRoom();
  }, []);

  // const isBookingAvailable = (menuId: number): boolean => {
  //   if (!selectedDates || inquiry.length === 0) return false;

  //   const menuStatus = inquiry.find(item => {
  //     console.log("현재 메뉴 체크:", item.menuId, menuId, item.check);
  //     return item.menuId === menuId;
  //   });

  //   const isAvailable = Boolean(menuStatus?.check);
  //   console.log(`메뉴 ${menuId}의 최종 예약가능여부:`, isAvailable);
  //   return isAvailable;
  // };

  const handleDateChange = (dates: any) => {
    if (dates) {
      const [start, end] = dates;
      const formattedStart = dayjs(start).format("YYYY-MM-DD");
      const formattedEnd = dayjs(end).format("YYYY-MM-DD");
      setSelectedDates([formattedStart, formattedEnd]);
      getRsrvtInquiry(formattedStart, formattedEnd);
    } else {
      setSelectedDates(null);
      setInquiry([]);
    }
  };

  const handleBookingClick = (item: any) => {
    if (!selectedDates) {
      message.warning("날짜를 선택해주세요");
      return;
    }

    navigate(`/booking/index?strfId=${strfId}`, {
      state: {
        quantity,
        dates: selectedDates,
        item,
        contentData,
        isRoom: isRoom,
      },
    });
  };

  console.log("isRoom", isRoom);
  const disabledDate = (current: Dayjs | null): boolean => {
    return !!current && current.isBefore(dayjs().startOf("day"));
  };

  return (
    <div className="mt-3">
      <div className="px-4">
        <RangePicker
          className="custom-lodgment-picker w-full border-slate-300 rounded-lg py-3 text-slate-700 mb-3"
          onChange={handleDateChange}
          disabledDate={disabledDate}
          format="YYYY-MM-DD"
        />
      </div>
      <ul>
        {menuData?.map((item, index) => (
          <li
            key={item.menuId}
            className="py-5 px-4 border-b-[10px] border-slate-100 last:border-b-0"
          >
            <i>
              <img
                src={`${MenuPic}/${strfId}/menu/${item?.menuPic}`}
                alt={item?.menuTitle}
                className="w-full aspect-[2/1] object-cover rounded-lg"
              />
            </i>
            <div className="my-3">
              <h2 className="text-2xl text-slate-700 font-semibold">
                {item?.menuTitle}
              </h2>
              <p className="flex items-center gap-[6px] text-slate-500 text-sm my-1">
                <BiTime className="text-base" />
                입실 {item.openCheckIn.replace(/:\d{2}$/, "")} - 퇴실
                {item.closeCheckIn.replace(/:\d{2}$/, "")}
              </p>
              <p className="flex items-center gap-[6px] text-slate-500 text-sm">
                <FiUsers className="text-base" />
                기준 {item.recomCapacity}인 / 최대 {item.maxCapacity}인
              </p>
              <div className="w-full border-t border-slate-100 mt-3 pt-3 flex justify-between items-center">
                <span className="text-xl text-slate-700 font-semibold">
                  {item.menuPrice.toLocaleString()}원
                </span>
                <Button
                  type="primary"
                  className="text-base py-2 px-4 h-auto rounded-lg"
                  onClick={() => handleBookingClick(item)}
                  disabled={!inquiry[index]?.check}
                >
                  {!inquiry[index]?.check ? "예약불가" : "예약하기"}
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Parlor;
