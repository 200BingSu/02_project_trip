import { Button, Form, Image, Input, Rate, Upload } from "antd";
import { useEffect, useState } from "react";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import jwtAxios from "../../../apis/jwt";
import { userAtom } from "../../../atoms/userAtom";
import TitleHeader from "../../../components/layout/header/TitleHeader";
import { REVIEW } from "../../../constants/api";
import { getCookie } from "../../../utils/cookie";
import axios from "axios";
import "../../../styles/antd-styles.css";

const getBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

const PostReview = () => {
  const user = getCookie("user");
  const accessToken = getCookie("accessToken");
  console.log("user", user);
  //쿼리스트링
  const [searchParmas] = useSearchParams();
  const strfId = searchParmas.get("strfId");
  //useNavigate
  const navigate = useNavigate();
  const navigateToStrf = () => navigate(`/contents/index?strfId=${strfId}`);
  const location = useLocation();
  const locationState = location.state;
  const [form] = Form.useForm();
  //useState
  const [fileList, setFileList] = useState([]);
  const [iswriting, setIswriting] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    console.log("fileList", fileList);
  }, [fileList]);

  // 폼 제출 핸들러
  const onFinish = async values => {
    const { content, file, rating, strfId, userId } = values;
    const pData = {
      userId: parseInt(userId),
      strfId: parseInt(strfId),
      rating: parseInt(rating),
      content: content,
    };
    const formData = new FormData();

    // file이 있을 때만 fileList 설정
    if (file?.fileList) {
      setFileList(file.fileList);
    }

    formData.append(
      "p",
      new Blob([JSON.stringify(pData)], { type: "application/json" }),
    );

    // 파일이 있을 때만 처리
    if (fileList?.length > 0) {
      fileList.forEach(fileItem => {
        formData.append("pics", fileItem.originFileObj);
      });
    }

    const blob = formData.get("p");
    if (blob) {
      blob.text().then(text => console.log("p의 내용:", pData));
    }
    // console.log("보낸 데이터", [...formData]);
    try {
      const response = await axios.post(`${REVIEW.postReview}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // console.log(response.data);
      if (response.data.code === "200 성공") {
        navigate(`/contents/index?strfId=${strfId}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  return (
    <div>
      <TitleHeader
        icon="back"
        onClick={() => {
          navigateToStrf();
        }}
        title={locationState?.strfTitle}
      />
      <div className="px-4">
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ userId: user.userId, strfId: strfId }}
        >
          <Form.Item label="userId" name="userId" hidden>
            <Input value={user.userId} />
          </Form.Item>
          <Form.Item label="strfId" name="strfId" hidden>
            <Input value={strfId} />
          </Form.Item>
          <Form.Item
            name="rating"
            className="flex flex-col justify-center items-center  text-slate-300"
            help={
              <div className=" text-base text-center  text-slate-300 mt-[6px] mb-6">
                별점을 선택해주세요.
              </div>
            }
          >
            <Rate style={{ fontSize: "2.25rem" }} />
          </Form.Item>
          <h3 className="mb-2 text-slate-700 text-lg text-center font-semibold">
            리뷰를 남겨주세요.
          </h3>
          <Form.Item
            name="content"
            rules={[{ required: true, message: "리뷰를 입력해주세요." }]}
          >
            <Input.TextArea
              rows={4}
              showCount
              maxLength={500}
              placeholder="직접 경험한 솔직한 리뷰를 남겨주세요."
              variant="borderless"
              onChange={() => setIswriting(true)}
              className={`custom-text-area rounded-2xl text-slate-700 placeholder: text-base placeholder: text-slate-400
                `}
            />
          </Form.Item>

          <Form.Item name="file">
            <Upload
              id="file"
              listType="picture-card"
              beforeUpload={() => false} // 파일 자동 업로드 방지
              accept="image/*"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              multiple
            >
              <MdOutlineAddPhotoAlternate className="text-4xl text-slate-400" />
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{
                  display: "none",
                }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: visible => setPreviewOpen(visible),
                  afterOpenChange: visible => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-[80px] py-[10px] rounded-lg
              text-[24px] font-semibold"
            >
              완료
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default PostReview;
