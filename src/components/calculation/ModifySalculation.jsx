import { Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { ProfilePic } from "../../constants/pic";

const ModifySalculation = ({
  getCookie,
  isModifyOpen,
  setIsModifyOpen,
  isReceipt,
  setIsReceipt,
  isValue,
  setIsValue,
  storeName,
  setStoreName,
  budgeting,
  deId,
  paidUserList,
  getStatement,
  getBudgeting,
  getExpenses,
}) => {
  const accessToken = getCookie("accessToken");
  const [checked, setChecked] = useState({});
  // 상품의 체크 리스트 처리
  const [checkList, setCheckList] = useState([]);

  useEffect(() => {
    setIsValue(isReceipt.totalPrice);
    setStoreName(isReceipt.paidFor);
  }, [isReceipt]);

  const getbill = async () => {
    try {
      const res = await axios.get(
        `/api/expense/trip_user?de_id=${deId}&trip_id=1`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log("========== getbill : ", res.data.data);
      const data = res.data.data;
      setCheckList(data);
    } catch (error) {
      console.log("✅ getbill error:", error);
    }
  };

  const putBill = async () => {
    // const sendCheckTrue = checkList.filter(item => item.is_join === true);
    // // 아이디 모음
    // const sendDataUser = sendCheckTrue.map(item => item.user_id);
    // console.log(sendDataUser);

    const sendDataUser = checkList
      .filter(({ is_join }) => is_join) // is_join이 true인 항목 필터링
      .map(({ user_id }) => user_id); // user_id만 추출
    const sendData = {
      total_price: isValue,
      // paid_user_list: paidUserList,
      paid_user_list: sendDataUser, // 필터링된 유저 ID 배열
      de_id: deId,
      paid_for: storeName,
      trip_id: 1,
    };
    try {
      const res = await axios.put(`/api/expense`, sendData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setIsModifyOpen(false);
      getExpenses();
      getBudgeting();
    } catch (error) {
      console.log("✅  error:", error, sendData);
    }
  };

  useEffect(() => {
    if (isModifyOpen) {
      getbill();
    }
  }, [isModifyOpen]);

  const handleChange = e => {
    let inputValue = e.target.value.replace(/\D/g, "");
    setIsValue(inputValue);
  };

  const handleCancel = () => {
    setIsValue(isReceipt.totalPrice); // 초기 금액으로 되돌림
    setStoreName(isReceipt.paidFor); // 초기 가게 이름으로 되돌림
    setIsModifyOpen(false);
  };

  const handleOk = () => {
    // isValue가 없거나 0 이하일 경우 실행 중지
    if (!isValue || isValue <= 0) {
      message.error("지출 금액은 0보다 커야 합니다.");
      setIsValue(isReceipt.totalPrice); // 기존 값으로 복원
      return;
    }

    // storeName이 비어 있으면 기존 값으로 복원
    if (!storeName.trim()) {
      setStoreName(isReceipt.paidFor);
    }

    putBill(); // ✅ 정산하기 버튼 클릭 시 실행
  };

  const handleChangeChecked = selectItem => {
    // console.log(selectItem);
    const tempArr = checkList.map(item => {
      if (item.user_id === selectItem.user_id) {
        item.is_join = !item.is_join;
      }
      return item;
    });

    console.log(tempArr);
    setCheckList(tempArr);
  };

  return (
    <Modal
      title="결제 수정"
      open={isModifyOpen}
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
                checked={item.is_join}
                onClick={() => {
                  handleChangeChecked(item);
                }}
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

export default ModifySalculation;
