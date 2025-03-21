import dayjs from "dayjs";
import { CgMoreVerticalAlt } from "react-icons/cg";
import { IPoint } from "../../../types/interface";
import BottomSheet from "../../basic/BottomSheet";
import { useState } from "react";
import { RiRefundLine } from "react-icons/ri";

import { getCookie } from "../../../utils/cookie";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { PoinData } from "../../../pages/business/point/Index";

interface PointItemProps {
  item: IPoint;
  getPointList: () => Promise<PoinData | null>;
}

const PointItem = ({ item, getPointList }: PointItemProps) => {
  console.log(item);
  // 쿠키
  const accessToken = getCookie("accessToken");
  const [isOpen, setIsOpen] = useState(false);
  // 쿼리
  const [searchParams] = useSearchParams();
  const strfId = searchParams.get("strfId");
  // API 포인트 사용 취소
  const deletePoint = async () => {
    const url = "/api/point/history";
    try {
      const res = await axios.delete(`${url}`, {
        data: {
          point_history_id: item.pointHistoryId,
          strf_id: strfId,
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const resultData = res.data;
      if (resultData.code == "200 성공") {
        setIsOpen(false);
        getPointList();
      }
      console.log("포인트 환불", resultData);
    } catch (error) {
      console.log("포인트 환불", error);
    }
  };
  const actions = [
    {
      label: (
        <button
          className={`flex items-center gap-3 px-4 py-[14px] text-lg text-slate-500`}
        >
          <RiRefundLine />
          환불하기
        </button>
      ),
      onClick: () => {
        deletePoint();

      },
    },
  ];

  return (
    <>
      <li className="flex flex-col gap-2 py-5 border-b border-slate-100">
        <div className="grid grid-cols-4 items-center">
          <h5 className="col-span-1 text-slate-700 font-semibold text-lg">
            거래 일시
          </h5>
          <p className="col-span-2 text-slate-600 text-lg">

            {dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}

          </p>
          <div className="flex justify-end">
            <button
              type="button"
              className="text-slate-500 text-xl"
              onClick={() => setIsOpen(true)}
            >
              <CgMoreVerticalAlt />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 items-center">
          <h5 className="col-span-1 text-slate-700 font-semibold text-lg">
            거래 구분
          </h5>
          <p
            className={`col-span-3 text-base px-2 rounded-sm w-fit flex items-center justify-center
            ${item.refund ? "bg-[rgba(253,180,161,0.3)] text-secondary3" : "bg-[rgba(165,238,254,0.3)] text-primary"}`}
          >
            {item.refund ? "환불" : "결제"}
          </p>
        </div>
        <div className="grid grid-cols-4 items-center">
          <h5 className="col-span-1 text-slate-700 font-semibold text-lg">
            내역
          </h5>
          <p className="col-span-3 text-slate-600 text-lg">{item.title}</p>
        </div>
        <div className="grid grid-cols-4 items-center">
          <h5 className="col-span-1 text-slate-700 font-semibold text-lg">
            결제 금액
          </h5>
          <p className="col-span-3 text-slate-600 text-lg">
            {item.amount.toLocaleString()}원
          </p>
        </div>
      </li>
      <BottomSheet
        open={isOpen}
        onClose={() => setIsOpen(false)}
        actions={actions}
      />
    </>
  );
};

export default PointItem;
