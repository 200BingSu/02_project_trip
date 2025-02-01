import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const SelectDays = () => {
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        weekends={false}
        // events={events}
        // eventContent={renderEventContent}
      />
    </div>
  );
};
export default SelectDays;
