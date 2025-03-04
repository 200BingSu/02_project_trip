import dayjs from "dayjs";
import "dayjs/locale/ko";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { CgMoreVerticalAlt } from "react-icons/cg";
import { IoIosArrowForward } from "react-icons/io";
import { ICoupon } from "../../../types/interface";

dayjs.locale("ko");
dayjs.extend(customParseFormat);

interface CouponItemProps {
  item: ICoupon;
  selected: boolean;
  onClick: () => void;
}

const CouponItem = ({
  item,
  selected,
  onClick,
}: CouponItemProps): JSX.Element => {
  const { couponId, title, discountPer, expiredAt, distributeAt } = item;
  const matchDate = (date: string): string => {
    return dayjs(date).format("YYYY-MM-DD(ddd)");
  };
  return (
    <div className="px-2 pt-2 pb-5">
      <div className="flex flex-col gap-2">
        {/* 쿠폰 내용 */}
        <ul className="flex flex-col gap-1 w-full ">
          <li className="flex justify-between items-center">
            <h4 className="text-lg text-slate-700 font-semibold">쿠폰 ID</h4>
            <p className="text-base text-slate-500 font-semibold">{couponId}</p>
          </li>
          <li className="flex justify-between items-center">
            <h4 className="text-lg text-slate-700 font-semibold">
              쿠폰 관리명
            </h4>
            <p className="text-base text-slate-500 font-semibold">{title}</p>
          </li>
        </ul>
        {/* 버튼 */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="flex items-center gap-2 text-base text-slate-500"
            onClick={onClick}
          >
            자세히
            <i
              className={`text-base text-slate-500 ${
                selected ? "rotate-90" : "rotate-0"
              } transition-transform duration-300`}
            >
              <IoIosArrowForward />
            </i>
          </button>
          <button type="button" className="text-base text-slate-500">
            <CgMoreVerticalAlt />
          </button>
        </div>
      </div>

      {/* 자세히 보기 */}

      <div
        className={`${selected ? "visible h-auto opacity-100 relative" : "invisible max-h-0 opacity-0 absolute"}
          overflow-hidden transition-[max-height] duration-300 ease-in-out opacity-transition`}
        style={{
          transitionProperty: "opacity, max-height, visibility",
          transitionDuration: selected ? "400ms" : "300ms",
        }}
      >
        {selected && (
          <ul>
            <li>
              <h5>쿠폰 ID</h5>
              <p>{couponId}</p>
            </li>
            <li>
              <h5>쿠폰 관리명</h5>
              <p>{title}</p>
            </li>
            <li>
              <h5>쿠폰 할인</h5>
              <p>{discountPer}%</p>
            </li>
            <li>
              <h5>쿠폰 유효기간</h5>
              <p>
                {matchDate(distributeAt)} ~ {matchDate(expiredAt)}
              </p>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default CouponItem;
