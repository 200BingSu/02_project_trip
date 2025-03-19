import { Button, Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProfilePic } from "../../constants/pic";
import { getCookie } from "../../utils/cookie";
import EditPayment from "./EditPayment";
import jwtAxios from "../../apis/jwt";

// 계산서 / 정산서 페이지
const Bill = ({ isOpen, setIsOpen, deId, tripId, getStatement }) => {
  const [isReceipt, setIsReceipt] = useState([]);
  const [editPaymentOpen, setEditPaymentOpen] = useState(false);

  const getBill = async () => {
    try {
      const res = await jwtAxios.get(
        `/api/expense/select?de_id=${deId}&trip_id=${tripId}`,
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
    setEditPaymentOpen(true);
    setIsOpen(false);
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
        closable={false} // 닫기(X) 아이콘 숨기기
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
          <h1 className="text-lg font-semibold text-slate-700 flex items-end gap-3 py-6">
            🧾
            {isReceipt.paidFor}
          </h1>
          <div>
            <div className="py-4 flex justify-between items-center border-t-2 border-dashed border-slate-500">
              <h2 className="text-base text-slate-400 font-semibold">
                결제 금액
              </h2>
              <p className="text-lg font-semibold text-slate-700">
                {isReceipt.totalPrice?.toLocaleString()}원
              </p>
            </div>
            <div className="py-4 flex justify-between items-center border-b-2 border-dashed border-slate-500">
              <p className="text-base text-slate-400 font-semibold">
                총 지출액
              </p>
              <p className="text-lg font-semibold text-slate-700">
                {isReceipt.totalPrice?.toLocaleString()}원
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-base text-slate-400 font-semibold py-5">
              정산 내역
            </h2>
            <div>
              {isReceipt?.payList?.map(item => (
                <div key={item.userId} className="flex items-center py-5">
                  <div className="flex items-center gap-[6px] mr-auto">
                    <p className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={`${ProfilePic}/${item?.userId}/${item?.profilePic}`}
                        alt={item.name}
                      />
                    </p>
                    <p className="text-base text-slate-700 font-semibold">
                      {item.name}
                    </p>
                  </div>
                  <p className="text-base text-slate-700">
                    {item.price?.toLocaleString()}원
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
      {editPaymentOpen && (
        <EditPayment
          isReceipt={isReceipt}
          editPaymentOpen={editPaymentOpen}
          setEditPaymentOpen={setEditPaymentOpen}
          deId={deId}
          getStatement={getStatement}
        />
      )}
    </div>
  );
};

export default Bill;
