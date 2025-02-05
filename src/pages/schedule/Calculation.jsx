import { Button } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { getCookie } from "../../utils/cookie";
import Bill from "./calculation/Bill";

const Calculation = () => {
  const [amount, setAmount] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    const interval = setInterval(() => {
      getExpenses();
    }, 5000); // 5초마다 getExpenses 호출

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  useEffect(() => {
    getExpenses();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };
  return (
    <div>
      <TitleHeader
        icon={"back"}
        title={"가계부"}
        onClick={() => navigate(-1)}
      />
      <div className="flex flex-col gap-8 mt-24 px-8 pb-36">
        <h1 className="flex items-end gap-3">
          <h2 className="text-4xl text-slate-700 font-bold">{amount?.title}</h2>
          <span className="text-lg text-slate-400">{amount?.tripPeriod}</span>
        </h1>
        <div>
          <h3 className="text-2xl text-slate-700">내가 쓴 금액</h3>
          <h2 className="text-4xl font-semibold text-primary">
            {amount?.myTotalPrice.toLocaleString()}원
          </h2>
        </div>
        <div className="cursor-pointer">
          {amount?.expensedList?.map(item => (
            <div
              key={item.deId}
              className="flex items-center py-8  border-b border-slate-100 last:border-0"
            >
              <div className="mr-auto w-2/4">
                <p className="text-2xl font-semibold text-slate-700 ">
                  {item.paidFor}
                </p>
                {item.paidUserList.map((member, index) => (
                  <span
                    key={member.user_id}
                    className="text-base text-slate-400"
                  >
                    {member.name}
                    {index !== item.paidUserList.length - 1 && ", "}
                  </span>
                ))}
              </div>
              <p className="text-2xl font-semibold text-primary">
                {item.totalPrice?.toLocaleString()}원
              </p>
            </div>
          ))}
        </div>
        <Button
          className="h-14 w-full border border-slate-300 rounded-lg text-slate-700 text-xl"
          onClick={showModal}
        >
          비용 추가
        </Button>
        <div className="fixed bottom-0 flex justify-center items-center max-w-3xl w-full h-[100px] bg-white z-[99] shadow-[0px_-10px_10px_-3px_rgba(99,99,99,0.05)]">
          <h1 className="text-2xl text-slate-700 ">
            총 지출액{" "}
            <span className="text-primary font-semibold">
              {amount?.tripTotalPrice?.toLocaleString()}
            </span>
            원
          </h1>
        </div>
      </div>

      <div>
        <Bill
          getCookie={getCookie}
          showModal={showModal}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
    </div>
  );
};

export default Calculation;
