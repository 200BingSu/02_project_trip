import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { useNavigate, useSearchParams } from "react-router-dom";
import Settlement from "../../../components/calculation/Settlement";
import TitleHeader from "../../../components/layout/header/TitleHeader";
import { ProfilePic } from "../../../constants/pic";
import { getCookie } from "../../../utils/cookie";
import { Button, message } from "antd";
import Bill from "../../../components/calculation/Bill";
import "../../../styles/antd-styles.css";
import jwtAxios from "../../../apis/jwt";
import { RiCopperCoinFill } from "react-icons/ri";
import { CgMoreVerticalAlt } from "react-icons/cg";
import BottomSheet from "../../../components/basic/BottomSheet";
import { BiSolidEditAlt, BiTrash } from "react-icons/bi";

const Calculation = () => {
  const [amount, setAmount] = useState([]);
  const [deId, setDeId] = useState(null); // ✅ 선택된 deId 상태 추가
  const [settlementIsOpen, setSettlementIsOpen] = useState(false);
  const [billIsOpen, setBillIsOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedDeId, setSelectedDeId] = useState(null);

  // 쿼리스트링
  const [searchParmas] = useSearchParams();
  const tripId = searchParmas.get("tripId");
  const accessToken = getCookie("accessToken");

  const navigate = useNavigate();

  // 가계부 보기
  const getStatement = async () => {
    try {
      const res = await jwtAxios.get(`/api/expense?trip_id=${tripId}`);
      setAmount(res.data.data);
      console.log(" 가계부 보기", res.data.data);
    } catch (error) {
      console.log("✅  error:", error);
    }
  };

  const deleteExpenses = async deId => {
    try {
      const res = await jwtAxios.delete(`/api/expense`, {
        data: {
          de_id: deId,
          trip_id: tripId,
        },
      });
      message.success("삭제되었습니다.");
      getStatement();
    } catch (error) {
      console.log("✅  error:", error);
      message.error("삭제에 실패했습니다.");
    }
  };

  useEffect(() => {
    getStatement();
  }, []);

  return (
    <div>
      <TitleHeader
        icon={"back"}
        title={`${amount?.title}`}
        onClick={() => navigate(-1)}
      />
      <div>
        <div className="py-3">
          <div className=" flex items-end gap-3 px-4 pb-[6px]">
            <span className="text-xs text-slate-400">
              {amount?.tripPeriod?.replace(/-/g, ".")}
            </span>
          </div>
          <div className="px-4 py-3 border-b border-slate-100">
            <h3 className="flex gap-[6px] text-base text-slate-700 mb-[6px]">
              <RiCopperCoinFill className="text-slate-300 text-2xl" />
              내가 쓴 금액
            </h3>
            <h2 className="text-2xl text-primary font-semibold">
              {amount?.myTotalPrice?.toLocaleString()}원
            </h2>
          </div>
          <div className="py-3 px-4 flex">
            <h1 className="text-base text-slate-500 mr-auto">총 지출 금액</h1>
            <span className="text-base font-semibold text-slate-700">
              {amount?.tripTotalPrice?.toLocaleString()}원
            </span>
          </div>
        </div>
        <section className="w-full h-[10px] bg-slate-100" />
        <div>
          {amount?.expensedList?.map(item => (
            <div
              key={item.deId}
              onClick={() => {
                setDeId(item.deId);
                setBillIsOpen(true);
              }}
              className="flex justify-between items-center py-6 px-4"
            >
              <div className="flex justify-between w-full ">
                <div className="flex flex-col justify-between cursor-pointer">
                  <p className="text-sm font-semibold text-slate-500">
                    {item.paidFor || "항목 없음"}
                  </p>
                  <div className="flex items-center gap-1 mt-5">
                    {item?.paidUserInfoList
                      ?.slice(0, 3)
                      .map((member, index) => (
                        <span
                          key={member.user_id}
                          className="inline-block w-10 h-10 !border-[3px] border-white rounded-full overflow-hidden -ml-5 first:ml-0 "
                          style={{ zIndex: 9 - index }} // zIndex 값 동적 적용
                        >
                          <img
                            src={`${ProfilePic}/${member?.user_id}/${member?.profile_pic}`}
                            alt={member.name}
                          />
                          {index !== item.paidUserInfoList?.length - 1 && ", "}
                        </span>
                      ))}
                    <span className="text-sm text-slate-500">
                      {item.paidUserInfoList.length === 1
                        ? `${item.paidUserInfoList[0]?.name}`
                        : `외 ${item.paidUserInfoList.length - 1}명`}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-end">
                  <span className="text-lg text-slate-500 font-semibold">
                    {item?.paidUserList}
                  </span>
                  <p className="text-lg text-slate-700 font-semibold">
                    {(item.totalPrice || 0).toLocaleString()}원
                  </p>
                  <p className="text-xs text-primary">
                    {(item.myPrice || 0).toLocaleString()}원
                  </p>
                </div>
              </div>
              <CgMoreVerticalAlt
                onClick={event => {
                  event.stopPropagation();
                  setSelectedDeId(item.deId);
                  setIsOpen(true);
                }}
                className="text-2xl text-slate-400 ml-3"
              />
            </div>
          ))}
        </div>
        <div className="sticky bottom-0 bg-white p-4 border-t border-slate-100 z-50">
          <Button
            type="primary"
            className="h-16 w-full rounded-2xl text-xl "
            onClick={() => setSettlementIsOpen(true)}
          >
            비용 추가
          </Button>
        </div>
      </div>

      <BottomSheet
        open={isOpen}
        onClose={() => setIsOpen(false)}
        actions={[
          {
            label: (
              <div className="flex items-center gap-3 text-lg">
                <BiTrash className="text-slate-400" />
                삭제하기
              </div>
            ),
            onClick: () => {
              if (selectedDeId) {
                deleteExpenses(selectedDeId);
                setIsOpen(false);
              }
            },
          },
        ]} // 선택된 아이템을 actions에 전달
      />
      {settlementIsOpen && (
        <Settlement
          tripId={tripId}
          deId={deId}
          isOpen={settlementIsOpen}
          setIsOpen={setSettlementIsOpen}
          getStatement={getStatement}
        />
      )}
      {billIsOpen && (
        <Bill
          isOpen={billIsOpen}
          setIsOpen={setBillIsOpen}
          deId={deId}
          tripId={tripId}
          getStatement={getStatement}
        />
      )}
    </div>
  );
};

export default Calculation;
