import { Input } from "antd";
import axios from "axios";
import { useState } from "react";
import { getCookie } from "../../utils/cookie";
import { useRecoilState } from "recoil";
import { tripAtom } from "../../atoms/tripAtom";

const MemoModal = ({ setMemoModal, tripId, data, getTrip, setTripData }) => {
  console.log("메모에서 읽는 data", data);
  // recoil
  const [trip, setTrip] = useRecoilState(tripAtom);
  const accessToken = getCookie("accessToken");
  //useState
  const [content, setContent] = useState("");
  // 모달창
  const handleBackgroundClick = () => {
    setMemoModal(false);
  };
  const handleModalClick = e => {
    e.stopPropagation();
  };
  //   검색창
  const onChange = e => {
    setContent(e.target.value);
  };
  //메모 추가하기
  const postMemo = async content => {
    const lastSeq =
      data.schedules.length > 0 ? data.schedules[schedules.length - 1].seq : 0;
    const sendData = {
      trip_id: trip.nowTripId,
      day: data.day,
      seq: lastSeq + 1,
      content: content,
    };
    console.log(sendData);
    try {
      const res = await axios.post(
        `/api/memo/post`,
        { ...sendData },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      // console.log("메모 추가", res.data);
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        getTrip();
      }
    } catch (error) {
      console.log("메모 추가", error);
    }
  };
  return (
    <div
      className="fixed top-0 left-[50%] translate-x-[-50%] z-10
                max-w-3xl w-full mx-auto h-full
                flex items-center justify-center
                bg-[rgba(0,0,0,0.5)]"
      onClick={() => {
        handleBackgroundClick();
      }}
    >
      {/* 모달창 */}
      <div
        className="bg-white w-[630px] 
                    rounded-2xl px-[60px] py-[55px]"
        onClick={handleModalClick}
      >
        <Input
          placeholder="메모를 입력해주세요."
          variant="borderless"
          allowClear
          onChange={e => {
            onChange(e);
          }}
        />
        <button
          type="button"
          onClick={() => {
            postMemo(content);
            setMemoModal(false);
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
};
export default MemoModal;
