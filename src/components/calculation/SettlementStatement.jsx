import { Button, Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { ProfilePic } from "../../constants/pic";
import { BiSolidEditAlt } from "react-icons/bi";
import ModifySalculation from "./ModifySalculation";

const SettlementStatement = ({
  deId,
  getCookie,
  isStatementOpen,
  setIsStatementOpen,
  isValue,
  setIsValue,
  storeName,
  setStoreName,
  budgeting,
  setBudgeting,
  paidUserList,
  getExpenses,
  setPaidUserList,
  getBudgeting,
}) => {
  console.log("SettlementStatement : ", deId);
  const [isReceipt, setIsReceipt] = useState([]);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const accessToken = getCookie("accessToken");

  const getStatement = async () => {
    try {
      const res = await axios.get(
        `/api/expense/select?de_id=${deId}&trip_id=1`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log("✅ 최신 데이터:", res.data.data);
      setIsReceipt(res.data.data);
    } catch (error) {
      console.log("✅  error:", error);
    }
  };

  useEffect(() => {
    if (isStatementOpen && deId && accessToken) {
      console.log("🔵 SettlementStatement getStatement 실행 중...");
      getStatement();
    }
  }, [isStatementOpen]); // ✅ 모달이 열릴 때(getStatement 실행)

  const handleOk = () => {
    setIsStatementOpen(false);
    setIsModifyOpen(true);
  };

  const handleCancel = () => {
    setIsStatementOpen(false);
  };

  return (
    <div>
      <Modal
        title="계산서"
        open={isStatementOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="custom-modal"
        footer={[
          <Button key="back" onClick={handleCancel}>
            확인
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            수정
          </Button>,
        ]}
      >
        <div className="px-8 pb-5">
          <h1 className="text-2xl font-bold text-slate-700 flex items-end gap-3 py-5">
            🧾
            {isReceipt.paidFor}
          </h1>
          <div>
            <h2 className="text-xl text-slate-500 font-semibold py-5 border-y-2 border-dashed border-slate-300">
              결제 금액
            </h2>
            <div className="py-5 flex items-center">
              <p className="text-xl text-slate-700 font-semibold mr-auto">
                총 지출액
              </p>
              <p className="text-2xl font-bold text-slate-700">
                {isReceipt.totalPrice?.toLocaleString()}원
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-xl text-slate-500 font-semibold py-5 border-y-2 border-dashed border-slate-300">
              정산 내역
            </h2>
            <div>
              {isReceipt?.payList?.map(item => (
                <div key={item.userId} className="flex items-center py-5">
                  <div className="flex items-center gap-5 mr-auto">
                    <p className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={`${ProfilePic}${item?.userId}/${item?.profilePic}`}
                        alt={item.name}
                      />
                    </p>
                    <p className="text-xl text-slate-700 font-semibold">
                      {item.name}
                    </p>
                  </div>
                  <p className="text-2xl  text-slate-500">
                    {item.price?.toLocaleString()}원
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
      <ModifySalculation
        getCookie={getCookie}
        getExpenses={getExpenses}
        isModifyOpen={isModifyOpen}
        setIsModifyOpen={setIsModifyOpen}
        isReceipt={isReceipt}
        setIsReceipt={setIsReceipt}
        isValue={isValue}
        setIsValue={setIsValue}
        storeName={storeName}
        setStoreName={setStoreName}
        budgeting={budgeting}
        setBudgeting={setBudgeting}
        deId={deId}
        paidUserList={paidUserList}
        setPaidUserList={setPaidUserList}
        getBudgeting={getBudgeting}
      />
    </div>
  );
};

export default SettlementStatement;
