import { Button, Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProfilePic } from "../../constants/pic";
import { getCookie } from "../../utils/cookie";
import EditPayment from "./EditPayment";

// 계산서 / 정산서 페이지
const Bill = ({ isOpen, setIsOpen, deId, tripId, getStatement }) => {
  console.log("Bill : ", deId);
  const [isReceipt, setIsReceipt] = useState([]);
  const [editPaymentOpen, setEditPaymentOpen] = useState(false);

  const accessToken = getCookie("accessToken");

  const getBill = async () => {
    try {
      const res = await axios.get(
        `/api/expense/select?de_id=${deId}&trip_id=${tripId}`,
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
    getBill();
  }, [isOpen]); // ✅ 모달이 열릴 때(getBill 실행)

  const handleOk = () => {
    setIsOpen(false);
    setEditPaymentOpen(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Modal
        title="계산서"
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="custom-modal"
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            수정
          </Button>,
          <Button key="back" onClick={handleCancel}>
            확인
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
      <EditPayment
        isReceipt={isReceipt}
        editPaymentOpen={editPaymentOpen}
        setEditPaymentOpen={setEditPaymentOpen}
        deId={deId}
        getStatement={getStatement}
      />
    </div>
  );
};

export default Bill;
