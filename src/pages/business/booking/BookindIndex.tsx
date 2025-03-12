import BookingList from "../../../components/business/booking/BookingList";
import FilterDate from "../../../components/business/booking/FilterDate";

const BookindIndex = (): JSX.Element => {
  return (
    <div>
      <FilterDate />
      <BookingList />
    </div>
  );
};

export default BookindIndex;
