import { Button, Modal, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { ProfilePic } from "../../../constants/pic";
import "../../../styles/antd-css.css";

const Bill = ({ getCookie, isBillOpen, setIsBillOpen, userInfo }) => {
  const [budgeting, setBudgeting] = useState([]);
  const [isValue, setIsValue] = useState("0");
  const [storeName, setStoreName] = useState("");
  const accessToken = getCookie("accessToken");
  const [checked, setChecked] = useState({});
  const [paidUserList, setPaidUserList] = useState([]);

  const getBudgeting = async () => {
    try {
      const res = await axios.get(`/api/expense/trip_user?trip_id=1`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("res", res);
      setBudgeting(res.data.data);
    } catch (error) {
      console.log("✅  getBudgeting  error:", error);
      setBudgeting([]); // 에러 발생 시 빈 배열로 초기화
    }
  };

  const setCalculation = async () => {
    const sendData = {
      trip_id: 1,
      total_price: isValue,
      paid_user_list: paidUserList,
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
      setIsBillOpen(false);
    } catch (error) {
      console.log("✅  error:", error.response?.data, sendData); // 서버에서 반환된 에러 메시지
    }
  };

  useEffect(() => {
    getBudgeting();
  }, []);

  const handleCheck = user_id => {
    setChecked(prev => {
      const newCheckedItems = {
        ...prev,
        [user_id]: !prev[user_id],
      };

      const paidUsers = Object.keys(newCheckedItems).filter(
        id => newCheckedItems[id],
      );
      setPaidUserList(paidUsers);

      console.log("paid_user_list:", paidUsers);

      return newCheckedItems;
    });
  };

  const handleOk = () => {
    if (!storeName) {
      message.error("내용을 입력해 주세요");
      return;
    }
    if (Number(isValue) < 1000) {
      message.error("가격은 1000원 이상이어야 합니다");
      return;
    }
    setCalculation(); // ✅ 정산하기 버튼 클릭 시 실행
    setIsValue("0");
    setStoreName("");
    setChecked({});
    setPaidUserList([]);
  };

  const handleCancel = () => {
    setIsBillOpen(false);
    setIsValue("0");
    setStoreName("");
    setChecked({});
    setPaidUserList([]);
  };

  const handleChange = e => {
    let inputValue = e.target.value.replace(/\D/g, ""); // 숫자 이외의 문자 제거
    if (inputValue === "") inputValue = "0"; // 빈 값이면 "0" 유지
    setIsValue(inputValue);
  };

  return (
    <Modal
      title="정산하기"
      open={isBillOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          취소
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          추가
        </Button>,
      ]}
    >
      <p className="text-lg text-slate-500 font-semibold px-8">지출 금액</p>
      <label htmlFor="" className="flex px-8 mt-3 mb-10">
        <input
          type="text"
          name="expenditurePice"
          value={isValue}
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
                checked={checked[item.user_id] || false} // 개별 상태 적용
                onChange={() => handleCheck(item.user_id)}
                className="peer hidden"
              />
              <div className="w-11 h-11 bg-slate-100  rounded-full flex items-center justify-center transition duration-300 peer-checked:bg-primary2 peer-checked:bg-opacity-50">
                <FaCheck
                  className={`text-2xl duration-300 ${
                    checked[item.user_id] ? "text-primary" : "text-slate-400"
                  }`}
                />
              </div>
            </label>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default Bill;
