import { Button, Input } from "antd";
import axios from "axios";
import { memo, useEffect, useState } from "react";
import { getCookie } from "../../utils/cookie";
import { useRecoilState } from "recoil";
import { tripAtom } from "../../atoms/tripAtom";

const MemoModal = ({
  setMemoModal,
  tripId,
  data,
  getTrip,
  setTripData,
  selectedMemo = null,
  handleClickCancle,
  handleClickSubmit,
}) => {
  // console.log("메모에서 읽는 selectedMemo", selectedMemo);
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
  useEffect(() => {
    if (selectedMemo) {
      setContent(selectedMemo.content);
    }
  }, [selectedMemo]);
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
                    rounded-2xl px-[60px] py-[55px]
                    flex flex-col items-start justify-center gap-[20px]"
        onClick={handleModalClick}
      >
        <h2 className="text-[24px] font-semibold px-2">메모</h2>
        <Input
          placeholder="메모를 입력해주세요."
          variant="borderless"
          allowClear
          value={content}
          onChange={e => {
            onChange(e);
          }}
        />
        <div className="flex gap-[20px] w-full">
          <Button
            color="default"
            variant="filled"
            onClick={() => {
              handleClickCancle();
            }}
            className="w-full"
          >
            취소
          </Button>
          <Button
            type="primary"
            onClick={() => {
              handleClickSubmit(content);
            }}
            className="text-white w-full"
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};
export default memo(MemoModal);
