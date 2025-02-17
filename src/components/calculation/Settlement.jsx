import { Button, message, Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { ProfilePic } from "../../constants/pic";
import { getCookie } from "../../utils/cookie";
import Bill from "./Bill";

const Settlement = ({ tripId, deId, isOpen, setIsOpen, getStatement }) => {
  const [isValue, setIsValue] = useState(0);
  const [storeName, setStoreName] = useState("");
  const [checkedItems, setCheckedItems] = useState({});
  const [attendee, setAttendee] = useState([]);
  const [billIsOpen, setBillIsOpen] = useState(false);
  const [newDeId, setNewDeId] = useState(null);

  const accessToken = getCookie("accessToken");

  // 결제할 인원 가져오기
  const getAttendee = async () => {
    try {
      const res = await axios.get(`/api/expense/trip_user?&trip_id=${tripId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setAttendee(res.data.data);
    } catch (error) {
      console.log("✅  error:", error);
    }
  };

  // 가계부 입력
  const setCalculation = async () => {
    const sendData = {
      trip_id: tripId,
      total_price: isValue,
      paid_user_list: Object.keys(checkedItems)
        .filter(userId => checkedItems[userId])
        .map(Number),
      paid_for: storeName,
    };

    try {
      const res = await axios.post("/api/expense", sendData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      // 성공 시 반환된 ID를 저장
      setNewDeId(res.data.data);
      setBillIsOpen(true);
      setIsOpen(false);
      message.success("추가 되었습니다");

      // Bill 컴포넌트에 새로운 deId 전달
      return res.data.data; // ID를 반환
    } catch (error) {
      console.log("✅  error:", error.response?.data, sendData);
    }
  };

  useEffect(() => {
    getAttendee();
  }, []);

  const handleChangeChecked = userId => {
    setCheckedItems(prev => ({ ...prev, [userId]: !prev[userId] }));
    console.log(userId);
  };

  const handleOk = async () => {
    if (!storeName.trim()) return message.error("내용을 입력해 주세요");
    if (Number(isValue) < 1000)
      return message.error("가격은 1000원 이상이어야 합니다");

    // setCalculation의 반환값(newDeId)을 받아서 Bill 컴포넌트에 전달
    const newDeId = await setCalculation();
    if (newDeId) {
      setBillIsOpen(true);
      setIsOpen(false);
    }
    getStatement();
    setIsValue("0");
    setStoreName("");
    setCheckedItems({});
  };

  const handleCancel = () => {
    setIsOpen(false);
    setIsValue("0");
    setStoreName("");
    setCheckedItems({});
  };

  return (
    <div>
      <Modal
        title="정산하기"
        open={isOpen}
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
        <div>
          {/* 지출 금액 */}
          <p className="text-lg text-slate-500 font-semibold px-8">지출 금액</p>
          <label htmlFor="" className="flex px-8 mt-3 mb-10">
            <input
              type="text"
              name="expenditurePice"
              value={
                isNaN(Number(isValue)) ? "0" : Number(isValue).toLocaleString()
              }
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
            {attendee.map(item => (
              <div
                key={item.user_id}
                className="flex items-center mt-8 justify-between px-8"
              >
                <div className="flex items-center gap-5 ">
                  <p className="w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src={`${ProfilePic}${item?.user_id}/${item.profile_pic}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
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
        </div>
      </Modal>
      <Bill
        isOpen={billIsOpen}
        setIsOpen={setBillIsOpen}
        deId={newDeId}
        tripId={tripId}
        getStatement={getStatement}
      />
    </div>
  );
};

export default Settlement;
