import { useNavigate } from "react-router-dom";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { useState } from "react";
import ScheduleDay from "../../components/scheduleboard/ScheduleDay";
import TextArea from "antd/es/input/TextArea";
import { Button } from "antd";

const PostBoard = () => {
  // useNavigate
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate(-1);
  };
  // useState
  const [preview, setPreview] = useState("");
  const [title, setTitle] = useState("여행기 제목");
  const [text, setText] = useState("");
  // 파일 업로더
  const handleClickInput = e => {
    console.log(e.target.files.FileList[0]);
  };
  const hadleChangePreivew = e => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };
  // textarea
  const handleInputHeight = e => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setText(e.target.value);
  };

  return (
    <div>
      <TitleHeader icon="back" onClick={navigateBack} title="여행기 공유" />
      <div className="mt-[60px] py-[40px] flex flex-col gap-[40px]">
        {/* 상단 */}
        <div className="flex flex-col gap-[48px] px-[32px]">
          {/* 업로드 */}
          <div
            className="w-full h-[160px]
                      flex items-center gap-[20px]"
          >
            {/* 숨겨진 파일 입력 */}
            <input
              id="fileUpload"
              type="file"
              accept="image/png, image/jpeg"
              onChange={hadleChangePreivew}
              className="hidden" // 기본 input을 숨김
            />
            {/* 커스텀 버튼 */}
            <label
              htmlFor="fileUpload"
              className="
            w-[160px] h-[160px] 
            flex items-center justify-center
            bg-slate-100 rounded-lg
            hover:bg-[#e9eef3]
            transition duration-300
            cursor-pointer shrink-0"
            >
              <MdOutlineAddPhotoAlternate
                size={60}
                className="text-slate-400"
              />
            </label>
            {/* 미리보기 */}
            {/* {preview && (
              <div
                className="flex-grow h-full
            rounded-lg overflow-hidden"
              >
                <img
                  src={preview}
                  alt="미리보기"
                  className="w-full h-full object-cover"
                />
              </div>
            )} */}
          </div>
          {/* 제목 */}
          <input
            type="text"
            className=" px-[10px] py-[10px]
            text-slate-400 text-[36px] font-semibold
            border-b border-slate-200
           focus:border-primary focus:outline-none
           "
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          {/* 소개 */}
          <TextArea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="이번 여행은 어떠셨나요? 여행에 대한 감상과 여행에서 경험한 꿀팁들을 남겨 다른 회원님들과 공유해보세요 !"
            autoSize={{
              minRows: 3,
              maxRows: 5,
            }}
            variant="borderless"
            className="placeholder: text-[24px] placeholder: text-slate-400"
          />
        </div>
        {/* 내용 */}
        <div className="px-[32px]">
          <ScheduleDay showMap={false} />
        </div>
        {/* 버튼 */}
        <div className="px-[32px] w-full">
          <Button
            type="primary"
            className="w-full h-[80px] 
                    text-slate-50 text-[24px] font-semibold"
          >
            완료
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostBoard;
