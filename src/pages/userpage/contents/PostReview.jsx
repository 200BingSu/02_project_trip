import React, { useEffect, useState } from "react";
import { Form, Rate, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { REVIEW } from "../../../constants/api";
import { useRecoilState } from "recoil";
import { userAtom } from "../../../atoms/userAtom";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import jwtAxios from "../../../apis/jwt";
import TitleHeader from "../../../components/layout/header/TitleHeader";
import { getCookie } from "../../../utils/cookie";
import { AiOutlinePlus } from "react-icons/ai";

const PostReview = () => {
  const accessToken = getCookie("accessToken");
  // recoil
  const [userInfo, setUserInfo] = useRecoilState(userAtom);
  useEffect(() => {
    // console.log(userInfo);
  }, [userInfo]);
  //useNavigate
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate(-1);
  };
  const navigateToContents = () => {
    navigate(`/contents/index?strfId=${strfId}`);
  };
  const location = useLocation();
  const locationState = location.state;
  const [form] = Form.useForm();
  //useState
  const [fileList, setFileList] = useState([]);
  const [iswriting, setIswriting] = useState(false);

  //쿼리스트링
  const [searchParmas] = useSearchParams();
  const strfId = searchParmas.get("strfId");
  // 파일 업로드 핸들러
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

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
    if (file?.fileList?.length > 0) {
      file.fileList.forEach(fileItem => {
        formData.append("pics", fileItem.originFileObj);
      });
    }

    const blob = formData.get("p");
    if (blob) {
      blob.text().then(text => console.log("p의 내용:", text));
    }
    // console.log("보낸 데이터", [...formData]);
    try {
      const response = await axios.post(`${REVIEW.postReview}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // console.log(response.data);
      if (response.data) {
        navigateToContents();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <TitleHeader
        icon="back"
        onClick={navigateToContents}
        title={locationState?.strfTitle}
      />
      <div className="px-[32px] mt-[60px]">
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ userId: userInfo.userId, strfId: strfId }}
          className="mt-[50px]"
        >
          <Form.Item label="userId" name="userId" hidden>
            <Input value={userInfo.userId} />
          </Form.Item>
          <Form.Item label="strfId" name="strfId" hidden>
            <Input value={strfId} />
          </Form.Item>
          <Form.Item
            name="rating"
            className="flex flex-col justify-center items-center gap-[10px] text-slate-300"
            help={
              <div className="text-center mt-[10px] text-slate-300">
                별점을 입력해주세요.
              </div>
            }
          >
            <Rate style={{ fontSize: 54 }} />
          </Form.Item>
          <h3 className="mb-[10px] text-slate-700 text-[24px] font-semibold">
            리뷰를 남겨주세요.
          </h3>
          <Form.Item
            name="content"
            rules={[{ required: true, message: "리뷰를 입력해주세요." }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="직접 경험한 솔직한 리뷰를 남겨주세요."
              variant="borderless"
              maxLength={100}
              style={{
                height: 300,
                resize: "none",
              }}
              onChange={() => setIswriting(true)}
              className={`placeholder: text-[20px] placeholder: text-slate-400
                ${iswriting ? "bg-white" : "bg-slate-50"}`}
            />
          </Form.Item>

          <Form.Item
            name="file"
            label={
              <h3 className="mb-[10px] text-slate-700 text-[24px] font-semibold">
                사진 첨부하기
              </h3>
            }
          >
            <Upload
              id="file"
              listType="picture"
              beforeUpload={() => false} // 파일 자동 업로드 방지
              fileList={fileList}
              onChange={handleChange}
              multiple
            >
              <div
                className="w-[136px] h-[136px] flex items-center justify-center
               bg-slate-100 hover:bg-[rgb(237,242,248)] rounded-lg
               transition"
              >
                <AiOutlinePlus className="text-[36px] text-slate-400" />
              </div>
            </Upload>
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
