import axios from "axios";
import { useEffect, useState } from "react";
import { ProfilePic } from "../../../constants/pic";
import { useRecoilState } from "recoil";
import { userAtom } from "../../../atoms/userAtom";
import { Modal, message } from "antd";

const Bill = ({ getCookie, showModal, isModalOpen, setIsModalOpen }) => {
  const [budgeting, setBudgeting] = useState([]);
  const [price, setPrice] = useState(0);
  const [storeName, setStoreName] = useState("");
  const [userInfo, setUserInfo] = useRecoilState(userAtom);
  const accessToken = getCookie("accessToken");

  const getBudgeting = async numericPrice => {
    try {
      const res = await axios.get(
        `/api/expense/dutch?total_price=${numericPrice}&trip_id=1`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setBudgeting(res.data.data);
      console.log(res.data);
      console.log(res.data.data);
    } catch (error) {
      console.log("✅  getBudgeting  error:", error);
      setBudgeting([]); // 에러 발생 시 빈 배열로 초기화
    }
  };

  // price 값이 바뀔 때마다 실행
  useEffect(() => {
    if (price) {
      let numericPrice = price ? 0 : Number(price.replace(/,/g, "")); // price가 0인 경우 기본값 0 설정
      getBudgeting(numericPrice);
    }
  }, [price]);

  const setCalculation = async () => {
    const sendData = {
      trip_id: 1,
      price_list: budgeting.map(item => ({
        userId: item.userId,
        price: item.price,
      })),
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
      setIsModalOpen(false);
    } catch (error) {
      console.log("✅  error:", error.response?.data, sendData); // 서버에서 반환된 에러 메시지
    }
  };

  const handleChange = e => {
    let rawValue = e.target.value.replace(/[^0-9]/g, "");
    setPrice(rawValue);
  };
  const handleOk = () => {
    if (!storeName) {
      message.error("내용을 입력해 주세요");
      return;
    }
    if (Number(price) < 1000) {
      message.error("가격은 1000원 이상이어야 합니다");
      return;
    }
    setCalculation(); // ✅ 정산하기 버튼 클릭 시 실행
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      title="정산하기"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div>
        <input
          type="text"
          value={storeName}
          onChange={e => setStoreName(e.target.value)}
          className="w-full h-20 outline-none text-right font-semibold text-2xl text-slate-500 px-2 border-b border-slate-200"
        />
        <label className="flex items-center font-semibold text-4xl text-slate-700 border-b border-slate-200">
          <input
            type="text"
            placeholder="0"
            value={new Intl.NumberFormat().format(price)} // 세 자리마다 콤마 적용
            onChange={handleChange}
            className="w-full h-20 outline-none text-right font-semibold text-5xl text-slate-700 px-2"
          />
          원
        </label>
        {budgeting?.map(item => (
          <div key={item.userId} className="flex items-center my-8">
            <p className="w-16 h-16 rounded-full">
              <img
                src={
                  `${ProfilePic}${userInfo?.userId}/${item.profilePic}` &&
                  `/images/user.png`
                }
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </p>
            <p className="text-xl text-slate-700 ml-5 mr-auto">{item.name}</p>
            <p className="text-2xl text-slate-700 font-semibold tracking-tight">
              {item.price?.toLocaleString()} 원
            </p>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default Bill;
