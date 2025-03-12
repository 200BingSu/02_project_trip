import { useSearchParams } from "react-router-dom";
import { ProductPic } from "../../../constants/pic";
import { useRecoilState } from "recoil";
import { strfAtom } from "../../../atoms/strfAtom";
import { useState } from "react";
import { Button, Form, Upload, UploadFile } from "antd";
import { matchName } from "../../../utils/match";
import { useForm } from "antd/es/form/Form";

const StroeEdit = (): JSX.Element => {
  // 쿼리
  const [searchParmas] = useSearchParams();
  const strfId = searchParmas.get("strfId");
  const category = searchParmas.get("category");
  // recoil
  const [strfData, setStrfData] = useRecoilState(strfAtom);
  const initialFileList: UploadFile[] = strfData.strfPics.map(
    (item, index) => ({
      uid: `-${index}`,
      name: item.strfPic,
      status: "done" as const,
      url: `${ProductPic}/${strfId}/${item.strfPic}`, // 경로 조합
    }),
  );
  // useState
  const [fileList, setFileList] = useState(initialFileList);
  // Form
  const [form] = useForm();
  const onFinish = (values: any) => {
    console.log("form", values);
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
  return (
    <div>
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
    </div>
  );
};

export default StroeEdit;
