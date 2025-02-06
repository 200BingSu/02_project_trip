import { Button } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { getCookie } from "../../utils/cookie";
import Bill from "./calculation/Bill";
import { ProfilePic } from "../../constants/pic";
import { userAtom } from "../../atoms/userAtom";
import { useRecoilState } from "recoil";
import SettlementStatement from "../../components/calculation/SettlementStatement";

const Calculation = () => {
  const [amount, setAmount] = useState(null);
  const [userInfo, setUserInfo] = useRecoilState(userAtom);
  const [isBillOpen, setIsBillOpen] = useState(false);
  const [isStatementOpen, setIsStatementOpen] = useState(false);

  const accessToken = getCookie("accessToken");
  const getExpenses = async () => {
    try {
      const res = await axios.get("/api/expense?trip_id=1", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setAmount(res.data.data);
      console.log("✅  res.data:", res.data.data);
    } catch (error) {
      console.log("✅  getExpenses  error:", error);
      setAmount(null); // 에러 발생 시 null로 초기화
    }
  };

  useEffect(() => {
    getExpenses();
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
            <h2 className="text-2xl text-slatr-700 font-bold">
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
              {amount?.myTotalPrice.toLocaleString()}원
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
              className="cursor-pointer bg-white px-8 py-5 rounded-3xl mt-5"
              onClick={() => setIsStatementOpen(true)}
            >
              <p>{item.deId}</p>
              <div className="">
                <p className="text-lg text-slate-500">{item.paidFor}</p>
                <p className="mt-1 text-3xl text-slate-700 font-semibold">
                  {item.totalPrice?.toLocaleString()}원
                </p>
                <div className="flex items-center gap-3 mt-5">
                  {item.paidUserList.slice(0, 3).map((member, index) => (
                    <span
                      key={member.user_id}
                      className="inline-block w-14 h-14 !border-4 border-white rounded-full overflow-hidden -ml-9 first:ml-0 "
                      style={{ zIndex: 9 - index }} // zIndex 값 동적 적용
                    >
                      <img
                        src={
                          `${ProfilePic}${member?.user_id}/${member?.profile_pic}` ||
                          `/images/user.png`
                        }
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
            </div>
          ))}
        </div>
        <Button
          type="primary"
          className="sticky bottom-5 h-16 w-full rounded-2xl text-xl z-50 mt-5"
          onClick={() => setIsBillOpen(true)}
        >
          비용 추가
        </Button>
      </div>

      <div>
        <Bill
          getCookie={getCookie}
          isBillOpen={isBillOpen}
          setIsBillOpen={setIsBillOpen}
          userInfo={userInfo}
        />
      </div>
      <div>
        <SettlementStatement
          amount={amount}
          setAmount={setAmount}
          getCookie={getCookie}
          isStatementOpen={isStatementOpen}
          setIsStatementOpen={setIsStatementOpen}
        />
      </div>
    </div>
  );
};

export default Calculation;
