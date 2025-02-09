import { useEffect, useState } from "react";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { useNavigate } from "react-router-dom";
const categoryArr = ["예약 목록", "예약 완료 내역"];
const UserBooking = () => {
  // useNavigate
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate(-1);
  };
  //useState
  const [category, setCategory] = useState(0);
  const [bookingData, setBookingData] = useState({});
  useEffect(() => {
    console.log("선택 카테고리", category);
  }, [category]);
  return (
    <div className="flex flex-col gap-[30px]">
      <TitleHeader icon="back" title="여행" onClick={navigateBack} />
    </div>
  );
};
export default UserBooking;
