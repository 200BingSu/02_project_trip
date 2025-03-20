import { BiTime } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { MenuPic } from "../../constants/pic";
import { MenuType } from "../../types/interface";
import { Button, DatePicker } from "antd";
import "../../styles/antd-styles.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import dayjs, { Dayjs } from "dayjs";
import { message } from "antd";
import jwtAxios from "../../apis/jwt";

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
}) => {
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState<inquiryCheck[]>([]);
  const [isRoom, setIsRoom] = useState<roomProps[]>([]);
  const [selectedDates, setSelectedDates] = useState<[string, string] | null>(
    null,
  );
  const [quantity] = useState(1);
  const [, setClickItem] = useState(null);

  const getRsrvtInquiry = async (start: string, end: string) => {
    try {
      const res = await jwtAxios.get(
        `/api/detail/check?strfId=${strfId}&checkIn=${start}&checkOut=${end}`,
      );
      if (res.data?.data) {
        setInquiry(res.data.data);
      }
      console.log("예약 가능 여부:", res.data);
    } catch (error) {
      console.log("예약 조회 에러:", error);
      setInquiry([]);
    }
  };
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

  const handleDateChange = (dates: any) => {
    if (dates) {
      const [start, end] = dates;
      const formattedStart = dayjs(start).format("YYYY-MM-DD");
      const formattedEnd = dayjs(end).format("YYYY-MM-DD");

      console.log("선택된 날짜 범위:", {
        start: formattedStart,
        end: formattedEnd,
      });

      setSelectedDates([formattedStart, formattedEnd]);
      getRsrvtInquiry(formattedStart, formattedEnd);
    } else {
      console.log("날짜 선택이 취소됨");
      setSelectedDates(null);
    }
  };

  const handleBooking = (item: any) => {
    if (!selectedDates) {
      message.error("날짜를 선택해주세요");
      return;
    }

    setClickItem(item);
    navigate(`/booking/index?strfId=${strfId}`, {
      state: {
        quantity: quantity,
        dates: selectedDates,
        item: item,
        contentData: contentData,
        isRoom: isRoom,
      },
    });
  };

  // 해당 메뉴의 예약 가능 여부 체크
  const isBookingAvailable = (menuId: number) => {
    // 날짜 선택 전이거나 로딩 중일 때는 예약 가능
    if (!selectedDates) return false;

    // inquiry 데이터가 있을 때만 체크
    if (inquiry && inquiry.length > 0) {
      const menuInquiry = inquiry.find(item => item.menuId === menuId);
      // check가 true면 예약 불가
      return menuInquiry?.check || false;
    }
    return false;
  };

  // 버튼 텍스트 결정
  const getButtonText = (menuId: number) => {
    if (isBookingAvailable(menuId)) return "예약불가";
    return "예약하기";
  };

  const handleBookingClick = (item: any) => {
    if (!selectedDates) {
      message.warning("날짜를 선택해주세요");
      return;
    }
    handleBooking(item);
  };

  const disabledDate = (current: Dayjs | null): boolean => {
    return !!current && current.isBefore(dayjs().startOf("day"));
  };

  return (
    <div className="mt-3 ">
      <div className="px-4">
        <RangePicker
          className="custom-lodgment-picker w-full border-slate-300 rounded-lg py-3 text-slate-700 mb-3"
          onChange={handleDateChange}
          disabledDate={disabledDate}
          format="YYYY-MM-DD"
        />

        {/* <button className="w-full border border-slate-300 rounded-lg py-3 text-base text-slate-700 mb-3">
          성인 2
        </button> */}
      </div>
      <ul>
        {menuData?.map(item => (
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
              <p className="flex items-center gap-[6px] text-slate-500 text-sm ">
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
                  disabled={isBookingAvailable(item.menuId)}
                >
                  {getButtonText(item.menuId)}
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
