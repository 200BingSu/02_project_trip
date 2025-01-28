import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const BookingIndex = () => {
  // 쿼리스트링
  const [searchParams, setSearchParams] = useSearchParams();
  const strfId = searchParams.get("strfId");

  //useNavigate
  const navigate = useNavigate();

  return <div>BookingIndex</div>;
};
export default BookingIndex;
