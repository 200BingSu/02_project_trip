import { useNavigate, useSearchParams } from "react-router-dom";
import { ProductPic } from "../../../constants/pic";
import { useRecoilState } from "recoil";
import { strfAtom } from "../../../atoms/strfAtom";
import { useState } from "react";
import { Button, Form, message, Spin, Upload, UploadFile } from "antd";
import { matchName } from "../../../utils/match";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { getCookie } from "../../../utils/cookie";
import { IAPI } from "../../../types/interface";

const StroeEdit = (): JSX.Element => {
  // 쿠키
  const accessToken = getCookie("accessToken");
  const userInfo = getCookie("user");
  const busiNum = userInfo.strfDtos[0].busiNum;
  console.log(busiNum);
  // 쿼리
  const [searchParmas] = useSearchParams();
  const strfId = searchParmas.get("strfId");
  const category = searchParmas.get("category");
  // navigate
  const navigate = useNavigate();
  const navigateToStore = () => {
    navigate(`/business/store?strfId=${strfId}&category=${category}&tab=0`);
  };
  // recoil
  const [strfData, _] = useRecoilState(strfAtom);
  const initialFileList: UploadFile[] = strfData.strfPics.map(
    (item, index) => ({
      uid: `-${index}`,
      name: item.strfPic,
      status: "done" as const,
      url: `${ProductPic}/${strfId}/${item.strfPic}`,
    }),
  );
  // useState
  const [fileList, setFileList] = useState(initialFileList);
  const [isLoading, setIsLoading] = useState(false);
  // Form
  const [form] = useForm();
  const onFinish = async (values: any) => {
    console.log("form", values);
    const pData = {
      strfId,
      busiNum,
    };
    const formData = new FormData();
    if (!fileList || fileList.length === 0) {
      console.error("fileList가 비어 있습니다!");
      return;
    }
    formData.append(
      "p",
      new Blob([JSON.stringify(pData)], { type: "application/json" }),
    );
    if (fileList.length ?? 0 > 0) {
      fileList.forEach(image => {
        formData.append("strfPic", image.originFileObj as File);
      });
    }
    await updateStrfPic(formData);
  };
  // antD 이미지
  const onChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };
  const onPreview = async (file: any) => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  // API 사진 변경
  const updateStrfPic = async (
    formData: FormData,
  ): Promise<IAPI<string> | null> => {
    const url = "/api/detail/strf/pic";
    setIsLoading(true);
    try {
      const res = await axios.put<IAPI<string>>(
        `${url}?strfId=${strfId}&busiNum=${busiNum}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        setIsLoading(false);
        message.success("사진 변경을 성공했습니다");
        navigateToStore();
      }
      console.log("사진 변경", res.data);
      return resultData;
    } catch (error) {
      console.log("사진 변경", error);
      message.error("사진 변경에 실패했습니다");
      setIsLoading(false);
      return null;
    }
  };
  return (
    <div>
      <Spin spinning={isLoading}>
        <Form form={form} onFinish={onFinish} name="strfPic">
          <Form.Item
            name="strfPic"
            rules={[
              {
                required: true,
                message: "메뉴 사진을 등록해주세요.",
                validator: () => {
                  if (fileList.length > 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("메뉴 사진을 등록해주세요."));
                },
              },
            ]}
            help={`${matchName(category)} 이미지는 다수(최대 5장)을 등록하실 수 있습니다.`}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
              beforeUpload={() => false}
              accept="image/*"
              maxCount={5}
            >
              {fileList.length < 5 && "+ Upload"}
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="text-lg"
            >
              등록하기
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default StroeEdit;
