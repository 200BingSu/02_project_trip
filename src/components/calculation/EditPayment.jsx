import { Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { ProfilePic } from "../../constants/pic";
import { useSearchParams } from "react-router-dom";
import { getCookie } from "../../utils/cookie";

// 결제 수정하기 페이지
const EditPayment = ({
  deId,
  isReceipt,
  editPaymentOpen,
  setEditPaymentOpen,
  getStatement,
}) => {
  const [isValue, setIsValue] = useState(0);
  const [storeName, setStoreName] = useState("");
  const [searchParmas] = useSearchParams();
  const [checkList, setCheckList] = useState([]);
  const tripId = searchParmas.get("tripId");
  const accessToken = getCookie("accessToken");

  // 결제할 인원 가져오기
  const getAttendee = async () => {
    try {
      const res = await axios.get(
        `/api/expense/trip_user?de_id=${deId}&trip_id=${tripId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log("Received data:", res.data.data);
      setCheckList(res.data.data);
    } catch (error) {
      console.log("✅  error:", error);
    }
  };

  useEffect(() => {
    setIsValue(isReceipt.totalPrice);
    setStoreName(isReceipt.paidFor);
  }, [isReceipt]);

  // 가계부 수정
  const putBill = async () => {
    const sendDataUser = checkList
      .filter(({ is_join }) => is_join)
      .map(({ user_id }) => user_id);

    const sendData = {
      total_price: isValue,
      paid_user_list: sendDataUser,
      de_id: deId,
      paid_for: storeName,
      trip_id: tripId,
    };

    try {
      const res = await axios.put(`/api/expense`, sendData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setEditPaymentOpen(false);
      getStatement();
    } catch (error) {
      console.log("✅  error:", error, sendData);
    }
  };

  useEffect(() => {
    if (editPaymentOpen) {
      getAttendee();
    }
  }, [editPaymentOpen]);

  const handleChange = e => {
    let inputValue = e.target.value.replace(/\D/g, "");
    setIsValue(inputValue);
  };

  const handleCancel = () => {
    setIsValue(isReceipt.totalPrice); // 초기 금액으로 되돌림
    setStoreName(isReceipt.paidFor); // 초기 가게 이름으로 되돌림
    setEditPaymentOpen(false);
  };

  const handleOk = () => {
    // isValue가 없거나 0 이하일 경우 실행 중지
    if (!isValue || isValue <= 0) {
      message.error("지출 금액은 0보다 커야 합니다.");
      setIsValue(isReceipt.totalPrice);
      return;
    }

    // storeName이 비어 있으면 기존 값으로 복원
    if (!storeName.trim()) {
      setStoreName(isReceipt.paidFor);
    }

    putBill();
  };

  const handleChangeChecked = selectItem => {
    setCheckList(prev =>
      prev.map(item => {
        if (item.user_id === selectItem.user_id) {
          return {
            ...item,
            is_join: !item.is_join, // 현재 상태를 반전
          };
        }
        return item;
      }),
    );
  };

  return (
    <Modal
      title="결제 수정"
      open={editPaymentOpen}
      onCancel={handleCancel}
      onOk={handleOk}
      className="custom-modal"
    >
      <p className="text-lg text-slate-500 font-semibold px-8">지출 금액</p>
      <label htmlFor="" className="flex px-8 mt-3 mb-10">
        <input
          type="text"
          name="expenditurePice"
          value={isValue}
          placeholder="0"
          onChange={handleChange}
          className="w-11/12 !border-none !border-transparent outline-0 !shadow-none text-4xl font-bold text-slate-700 !text-right  "
        />
        <span className="text-4xl font-bold text-slate-700">원</span>
      </label>

      <label
        htmlFor=""
        className="text-lg text-slate-500 font-semibold px-8 w-full inline-block"
      >
        지출 내용
        <input
          type="text"
          name="expenditureName"
          value={storeName}
          onChange={e => setStoreName(e.target.value)}
          className="h-20 w-full border border-slate-300 rounded-2xl px-5 mt-3 text-2xl text-slate-700 outline-none"
        />
      </label>
      <div>
        <p className="px-8 w-full py-5 border-y border-slate-200 text-lg font-semibold text-slate-500 mt-8">
          참여자
        </p>
        {checkList.map(item => (
          <div
            key={item.user_id}
            className="flex items-center mt-8 justify-between px-8"
          >
            <div className="flex items-center gap-5 ">
              <p className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  src={`${ProfilePic}/${item?.user_id}/${item.profile_pic}`}
                  alt={item.name}
                />
              </p>
              <p className="text-lg text-slate-700 font-semibold">
                {item.name}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="peer hidden"
                checked={item.is_join}
                onChange={() => handleChangeChecked(item)}
              />
              <div className="w-11 h-11 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center transition duration-300 peer-checked:bg-primary2 peer-checked:text-primary peer-checked:bg-opacity-50">
                <FaCheck className="text-2xl duration-75" />
              </div>
            </label>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default EditPayment;
