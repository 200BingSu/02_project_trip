import { Button, DatePicker } from "antd";
import { BiCalendar } from "react-icons/bi";

const FilterDate = () => {
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
          />
        </div>
      </div>
      {/* 검색 버튼 */}
      <Button type="primary" className="text-xl py-1 max-h-[50px] h-[16vw]">
        검색하기
      </Button>
    </div>
  );
};

export default FilterDate;
