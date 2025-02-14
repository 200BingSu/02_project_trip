import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import axios from "axios";
import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { useSearchParams } from "react-router-dom";
import Settlement from "../../components/calculation/Settlement";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { ProfilePic } from "../../constants/pic";
import { getCookie } from "../../utils/cookie";
import { Button } from "antd";
import Bill from "../../components/calculation/Bill";

const Calculation = () => {
  const [amount, setAmount] = useState([]);
  const [deId, setDeId] = useState(null); // ✅ 선택된 deId 상태 추가
  const [settlementIsOpen, setSettlementIsOpen] = useState(false);
  const [billIsOpen, setBillIsOpen] = useState(false);

  // 쿼리스트링
  const [searchParmas] = useSearchParams();
  const tripId = searchParmas.get("tripId");
  const accessToken = getCookie("accessToken");

  // 가계부 보기
  const getStatement = async () => {
    try {
      const res = await axios.get(`/api/expense?trip_id=${tripId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setAmount(res.data.data);
    } catch (error) {
      console.log("✅  error:", error);
    }
  };

  useEffect(() => {
    getStatement();
  }, []);

  return (
    <div className="bg-slate-100 pb-4">
      <TitleHeader
        icon={"back"}
        title={"가계부"}
        onClick={() => navigate(-1)}
        className="!bg-slate-100"
      />
      <div className="px-8">
        <div className="bg-white rounded-3xl px-8">
          <div className=" flex items-end gap-3 border-b  py-8 border-slate-200">
            <h2 className="text-2xl text-slate-700 font-bold">
              {amount?.title}
            </h2>
            <span className="text-base text-slate-400">
              {amount?.tripPeriod}
            </span>
          </div>
          <div className="py-8 border-b border-slate-200">
            <h3 className="text-xl font-semibold text-slate-700">
              내가 쓴 금액
            </h3>
            <h2 className="text-4xl text-primary font-semibold">
              {amount?.myTotalPrice?.toLocaleString()}원
            </h2>
          </div>
          <div className="py-8 flex">
            <h1 className="text-lg text-slate-500 mr-auto">총 지출 금액</h1>
            <span className="text-2xl text-slate-700 font-semibold">
              {amount?.tripTotalPrice?.toLocaleString()}원
            </span>
          </div>
        </div>
        <div>
          {amount?.expensedList?.map(item => (
            <div
              key={item.deId}
              className="flex justify-between cursor-pointer bg-white px-8 py-5 rounded-3xl mt-5"
            >
              <div
                className="w-full"
                onClick={() => {
                  console.log("여기 클릭", item.deId);
                  setDeId(item.deId);
                  setBillIsOpen(true);
                }}
              >
                <p className="text-lg text-slate-500">
                  {item.paidFor || "항목 없음"}
                </p>
                <p className="mt-1 text-3xl text-slate-700 font-semibold">
                  {(item.totalPrice || 0).toLocaleString()}원
                </p>
                <div className="flex items-center gap-3 mt-5">
                  {item.paidUserList.slice(0, 3).map((member, index) => (
                    <span
                      key={member.user_id}
                      className="inline-block w-14 h-14 !border-4 border-white rounded-full overflow-hidden -ml-9 first:ml-0 "
                      style={{ zIndex: 9 - index }} // zIndex 값 동적 적용
                    >
                      <img
                        src={`${ProfilePic}${member?.user_id}/${member?.profile_pic}`}
                        alt={member.name}
                      />
                      {index !== item.paidUserList.length - 1 && ", "}
                    </span>
                  ))}
                  <span className="text-lg text-slate-500 font-semibold">
                    {item.paidUserList.length === 1
                      ? `${item.paidUserList[0]?.name}`
                      : `${item.paidUserList[0]?.name} 외 ${item.paidUserList.length - 1}명`}
                  </span>
                </div>
              </div>
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton>
                    <IoMdMore
                      aria-hidden="true"
                      className="size-9 text-slate-400"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10  py-2 px-5 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  onClick={e => {
                    e.stopPropagation(); // 부모 요소의 onClick 이벤트가 실행되지 않도록 함
                    deleteExpenses(item.deId);
                  }}
                >
                  <div>
                    <MenuItem>
                      <p className="w-14 flex items-center gap-2 text-base text-error data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden z-[99]">
                        <FaTrashAlt />
                        삭제
                      </p>
                    </MenuItem>
                  </div>
                </MenuItems>
              </Menu>
            </div>
          ))}
        </div>
        <Button
          type="primary"
          className="sticky bottom-5 h-16 w-full rounded-2xl text-xl z-50 mt-5"
          onClick={() => setSettlementIsOpen(true)}
        >
          비용 추가
        </Button>
      </div>

      <Settlement
        tripId={tripId}
        deId={deId}
        isOpen={settlementIsOpen}
        setIsOpen={setSettlementIsOpen}
      />
      <Bill
        isOpen={billIsOpen}
        setIsOpen={setBillIsOpen}
        deId={deId}
        tripId={tripId}
      />
    </div>
  );
};

export default Calculation;
