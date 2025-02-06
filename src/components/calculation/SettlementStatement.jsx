import { Button, Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { ProfilePic } from "../../constants/pic";
import { BiSolidEditAlt } from "react-icons/bi";

const SettlementStatement = ({
  deId,
  getCookie,
  isStatementOpen,
  setIsStatementOpen,
}) => {
  const [isReceipt, setIsReceipt] = useState([]);
  const accessToken = getCookie("accessToken");
  console.log("deId 내놔", deId);
  const getStatement = async () => {
    if (!isStatementOpen || !deId) return; // ✅ deId가 없으면 요청하지 않음
    try {
      const res = await axios.get(
        `/api/expense/select?de_id=${deId}&trip_id=1`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setIsReceipt(res.data.data);
      console.log("isReceipt", isReceipt);
      console.log("amount", amount);
      console.log("✅  getStatement :", res.data.data);
    } catch (error) {
      console.log("✅  error:", error);
    }
  };

  useEffect(() => {
    getStatement();
  }, [deId]);

  const handleOk = () => {
    setIsStatementOpen(false);
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
            <div className="py-5">
              <p className="text-xl text-slate-700 font-semibold mr-auto">
                총 지출액
              </p>
              <p className="text-2xl font-bold text-slate-700">
                {isReceipt.totalPrice}
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
                  <p className="text-2xl  text-slate-500">{item.price}원</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SettlementStatement;
