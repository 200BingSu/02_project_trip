import { Button, Modal, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { ProfilePic } from "../../../constants/pic";

const Bill = ({
  getCookie,
  isBillOpen,
  setIsBillOpen,
  userInfo,
  getExpenses,
  isValue,
  setIsValue,
  storeName,
  setStoreName,
  budgeting,
  setBudgeting,
  paidUserList,
  setPaidUserList,
}) => {
  const [checkedItems, setCheckedItems] = useState({});
  const accessToken = getCookie("accessToken");

  const setCalculation = async () => {
    const sendData = {
      trip_id: 1,
      total_price: isValue,
      paid_user_list: Object.keys(checkedItems)
        .filter(userId => checkedItems[userId])
        .map(Number),
      paid_for: storeName,
    };

    console.log("sendData", sendData);
    try {
      const res = await axios.post("/api/expense", sendData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      message.success("추가 되었습니다");
      handleCancel(); // 모달 닫기 및 상태 초기화
      getExpenses(); // ✅ 데이터 새로 요청
    } catch (error) {
      console.log("✅  error:", error.response?.data, sendData); // 서버에서 반환된 에러 메시지
    }
  };

  const handleChangeChecked = userId => {
    setCheckedItems(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handleOk = () => {
    if (!storeName.trim()) return message.error("내용을 입력해 주세요");
    if (Number(isValue) < 1000)
      return message.error("가격은 1000원 이상이어야 합니다");
    setCalculation();
  };

  const handleCancel = () => {
    setIsBillOpen(false);
    setIsValue("0");
    setStoreName("");
    setCheckedItems({});
  };

  return (
    <Modal
      title="정산하기"
      open={isBillOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      className="custom-modal"
      footer={[
        <Button key="back" onClick={handleCancel}>
          취소
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          추가
        </Button>,
      ]}
    >
      {/* 지출 금액 */}
      <p className="text-lg text-slate-500 font-semibold px-8">지출 금액</p>
      <label htmlFor="" className="flex px-8 mt-3 mb-10">
        <input
          type="text"
          name="expenditurePice"
          value={Number(isValue).toLocaleString()}
          placeholder="0"
          onChange={e => setIsValue(e.target.value.replace(/\D/g, ""))}
          className="w-11/12 !border-none !border-transparent outline-0 !shadow-none text-4xl font-bold text-slate-700 !text-right"
        />
        <span className="text-4xl font-bold text-slate-700">원</span>
      </label>

      {/* 지출 내용 */}
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

      {/* 참여자 목록 */}
      <div>
        <p className="px-8 w-full py-5 border-y border-slate-200 text-lg font-semibold text-slate-500 mt-8">
          참여자
        </p>
        {budgeting.map(item => (
          <div
            key={item.user_id}
            className="flex items-center mt-8 justify-between px-8"
          >
            <div className="flex items-center gap-5 ">
              <p className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  src={`${ProfilePic}${item?.user_id}/${item.profile_pic}`}
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
                checked={checkedItems[item.user_id] || false}
                onChange={() => handleChangeChecked(item?.user_id)}
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

export default Bill;
