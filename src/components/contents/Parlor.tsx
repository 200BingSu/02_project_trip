import { BiTime } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { MenuPic } from "../../constants/pic";
import { MenuType } from "../../types/interface";
import { Button, DatePicker } from "antd";
import "../../styles/antd-styles.css";

const { RangePicker } = DatePicker;

const Parlor = ({
  strfId,
  menuData,
}: {
  strfId: number;
  menuData: MenuType[];
}) => {
  return (
    <div className="mt-3 ">
      <div className="px-4">
        <RangePicker className="custom-lodgment-picker w-full border-slate-300 rounded-lg py-3 text-slate-700 mb-3" />

        <button className="w-full border border-slate-300 rounded-lg py-3 text-base text-slate-700 mb-3">
          성인 2
        </button>
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
                >
                  예약하기
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
