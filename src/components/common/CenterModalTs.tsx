import { Button } from "antd";
import { memo, MouseEvent } from "react";
import { PiWarningCircleBold } from "react-icons/pi";
import { FcHighPriority } from "react-icons/fc";

interface CenterModalProps {
  handleClickCancle?: () => void;
  handleClickSubmit: () => void;
  content: string;
  type?: "warning" | "error" | "info" | "success" | "delete";
  title?: string;
}

/**
 * ## 중앙 모달
 * @param handleClickCancle
 * 취소 버튼 클릭 시 실행되는 함수
 * @param handleClickSubmit
 * 확인 버튼 클릭 시 실행되는 함수
 * @param content
 * 모달 내용
 * @param type
 * 모달 타입
 */
const CenterModal = ({
  handleClickCancle = () => {},
  handleClickSubmit = () => {},
  content = "",
  type,
  title = "",
}: CenterModalProps) => {
  //모달
  const handleBackgroundClick = () => {
    handleClickCancle();
  };

  const handleModalClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  return (
    <div
      className="fixed top-0 left-[50%] translate-x-[-50%] z-10
                max-w-3xl w-full mx-auto h-screen
                flex items-center justify-center
                bg-[rgba(0,0,0,0.5)]
                "
      onClick={() => {
        handleBackgroundClick();
      }}
    >
      {/* 모달창 */}
      <div
        className="bg-white 
                    rounded-2xl px-[60px] py-[30px]
                    flex flex-col items-center justify-center
                    gap-[20px]
                    "
        onClick={handleModalClick}
      >
        {/* 모달 내용 */}
        <div className="flex flex-col gap-2">
          <div className="flex w-full">
            <i className="text-slate-700 text-4xl">
              {type === "warning" && (
                <PiWarningCircleBold className="text-yellow-400" />
              )}
              {type === "error" && <FcHighPriority className="text-red-400" />}
            </i>
          </div>
          <p className="text-2xl font-semibold text-slate-700">{title}</p>
          <p className="text-slate-700">{content}</p>
        </div>
        {/* 버튼 목록 */}

        <div className="flex gap-[20px] justify-end w-full">
          {(type === "info" ||
            type === "success" ||
            type === "delete" ||
            type === undefined) && (
            <Button
              htmlType="button"
              className="px-[15px] py-[20px] text-[20px] text-slate-400 font-semibold
            w-fit"
              onClick={handleClickCancle}
            >
              취소
            </Button>
          )}
          <Button
            type="primary"
            htmlType="button"
            className="px-[15px] py-[20px] text-[20px] text-white font-semibold
            w-fit"
            onClick={handleClickSubmit}
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(CenterModal);
