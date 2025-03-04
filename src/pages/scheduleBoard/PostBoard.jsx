import { useNavigate, useSearchParams } from "react-router-dom";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { useEffect, useState } from "react";
import ScheduleDay from "../../components/scheduleboard/ScheduleDay";
import TextArea from "antd/es/input/TextArea";
import { Button, Form, Input, Upload } from "antd";
import axios from "axios";
import { getCookie } from "../../utils/cookie";
import jwtAxios from "../../apis/jwt";

const PostBoard = () => {
  const accessToken = getCookie("accessToken");
  // 쿼리스트링
  const [searchParams] = useSearchParams();
  const tripId = parseInt(searchParams.get("tripId"));
  // useNavigate
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate(-1);
  };
  const navigateToScheduleBoard = () => {
    navigate(`/scheduleboard/index`);
  };
  // useState
  const [preview, setPreview] = useState("");
  const [title, setTitle] = useState("여행기 제목");
  const [text, setText] = useState("");
  const [tripData, setTripData] = useState({});
  const [fileList, setFileList] = useState([]);

  const [primary, setPrimary] = useState(false);

  // 여행 확인하기
  const getTrip = async () => {
    try {
      const res = await jwtAxios.get(`/api/trip?trip_id=${tripId}`);
      console.log("여행확인하기", res.data);
      const resultData = res.data.data;
      setTripData(resultData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTrip();
  }, []);

  //form
  const [form] = Form.useForm();
  // 파일 업로드 핸들러
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  // 폼 제출 핸들러
  const onFinish = async values => {
    const { title, file, content } = values;
    const req = {
      tripId: tripId,
      title: title,
      content: content,
    };
    const formData = new FormData();
    setFileList(file.fileList);
    formData.append(
      "req",
      new Blob([JSON.stringify(req)], { type: "application/json" }),
    );
    console.log(values);
    console.log(fileList);
    // const formData = new FormData();
    // formData.append("rating", values.rating);
    // formData.append("comment", values.comment);

    // // 파일이 있으면 폼 데이터에 추가
    if (file && file.fileList && file.fileList.length > 0) {
      // file.fileList 배열을 순회하며 각 파일을 formData에 append
      file.fileList.forEach(fileItem => {
        formData.append("tripReviewPic", fileItem.originFileObj);
      });
    }

    const blob = formData.get("p");
    if (blob) {
      blob.text().then(text => console.log("p의 내용:", text));
    }
    console.log("보낸 데이터", [...formData]);
    try {
      const response = await jwtAxios.post(`/api/trip-review`, formData);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
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
        {/* 상단: 여행기 */}
        <div className="flex flex-col  px-[32px]">
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            className="flex flex-col gap-[48px]"
          >
            {/* 업로드 */}
            <Form.Item name="file">
              <Upload
                id="file"
                listType="picture-card"
                beforeUpload={() => false} // 파일 자동 업로드 방지
                fileList={fileList}
                onChange={handleChange}
                // showUploadList={false}
                multiple
              >
                <div
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
                </div>
              </Upload>
            </Form.Item>
            {/* 제목 */}
            <Form.Item
              name="title"
              className={`border-b ${primary ? "border-primary" : "border-slate-200"}`}
            >
              <Input
                variant="borderless"
                className=" px-[10px] py-[10px]
                text-slate-400 text-[36px] font-semibold
              placeholder:text-slate-400
                 "
                onFocus={() => setPrimary(true)}
                onBlur={() => setPrimary(false)}
                placeholder="여행기 제목"
              />
            </Form.Item>
            <Form.Item name="content">
              <Input.TextArea
                rows={4}
                placeholder="이번 여행은 어떠셨나요? 여행에 대한 감상과 여행에서 경험한 꿀팁들을 남겨 다른 회원님들과 공유해보세요 !"
                variant="borderless"
                maxLength={100}
                autoSize={{
                  minRows: 3,
                  maxRows: 5,
                }}
                style={{
                  height: 300,
                  resize: "none",
                }}
                className="placeholder: text-[24px] placeholder: text-slate-400"
              />
            </Form.Item>
            {/* 내용 */}
            <div className="flex flex-col gap-[50px]">
              {tripData.days?.map((item, index) => {
                return (
                  <ScheduleDay data={item} showMap={false} readOnly={true} />
                );
              })}
            </div>
            {/* 버튼 */}
            <Form.Item className="w-full">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-[80px] 
                    text-slate-50 text-[24px] font-semibold"
                onClick={navigateToScheduleBoard}
              >
                완료
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default PostBoard;
