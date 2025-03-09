import {
  Button,
  Form,
  Input,
  InputNumber,
  Spin,
  Upload,
  UploadFile,
} from "antd";
import ImgCrop from "antd-img-crop";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useState } from "react";
import { RiArrowGoBackFill } from "react-icons/ri";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CategoryType } from "../../../types/enum";
import { Imenu } from "../../../types/interface";
import { getCookie } from "../../../utils/cookie";
import { categoryKor, matchName } from "../../../utils/match";
interface Ptype {
  strfId: number;
  busiNum: string;
  category: string;
  menus: Imenu[];
}
interface MenuFormProps {
  handleCurrent: (value: number | null) => void;
  hadleMenuId: (value: string | null) => void;
}
const MenuForm = ({ handleCurrent, hadleMenuId }: MenuFormProps) => {
  // 쿼리
  const [searchParams] = useSearchParams();
  const strfId = Number(searchParams.get("strfId"));
  const category = searchParams.get("category");
  // navigate
  const navigate = useNavigate();
  const navigateToNext = () => {
    if (category === CategoryType.STAY) {
      handleCurrent(1);
    } else {
      navigate(`/business/menu?strfId=${strfId}&category=${category}`);
    }
  };

  // 쿠키
  const userInfo = getCookie("user");
  const busiNum = userInfo?.busiNum;
  const accessToken = getCookie("accessToken");

  const [form] = useForm();
  // 파일 업로드
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [, setValue] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
    // Form에 수동으로 값을 설정
    form.setFieldValue("menuPic", newFileList);
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
  // API 메뉴 등록
  const createMenu = async (
    data: FormData,
  ): Promise<{ code: string; data: string } | null> => {
    setIsLoading(true);
    const url = "/api/detail/menu";
    try {
      const res = await axios.post<{ code: string; data: string }>(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("메뉴 등록", res.data);
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        setIsLoading(false);
        hadleMenuId(resultData.data);
        navigateToNext();
      }
      return res.data;
    } catch (error) {
      console.error("메뉴 등록 실패", error);
      setIsLoading(false);
      return null;
    }
  };
  // 메뉴 폼제출
  const onFinish = (values: any) => {
    const { menuTitle, menuPrice } = values;
    console.log(values);
    const p: Ptype = {
      strfId: strfId,
      busiNum: busiNum,
      category: categoryKor(category) as string,
      menus: [
        {
          menuTitle: menuTitle,
          menuPrice: menuPrice,
        },
      ],
    };
    console.log("p", p);
    const formData = new FormData();
    formData.append("menuPic", fileList[0].originFileObj as File);
    formData.append(
      "p",
      new Blob([JSON.stringify(p)], { type: "application/json" }),
    );

    createMenu(formData);
  };
  return (
    <section className="flex flex-col gap-2 px-4 py-3">
      <Spin spinning={isLoading}>
        <Form form={form} onFinish={onFinish} name="menu">
          <div className="py-2 flex flex-col gap-1">
            <h3 className="text-slate-700 text-lg font-semibold">
              {matchName(category)} 사진
            </h3>
            <p className="text-sm text-slate-500">
              {matchName(category)} 이미지를 등록해주세요.
            </p>
          </div>
          <Form.Item
            name="menuPic"
            rules={[
              {
                required: true,
                message: "메뉴 사진을 등록해주세요.",
                validator: (_, value) => {
                  if (fileList.length > 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("메뉴 사진을 등록해주세요."));
                },
              },
            ]}
            help={`${matchName(category)} 이미지는 최대 1장입니다.`}
          >
            <ImgCrop rotationSlider>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
                beforeUpload={() => false}
                accept="image/*"
                maxCount={1}
              >
                {fileList.length < 1 && "+ Upload"}
              </Upload>
            </ImgCrop>
          </Form.Item>
          <div className="py-2 flex flex-col gap-1">
            <h3 className="text-slate-700 text-lg font-semibold">
              {matchName(category)} 이름
            </h3>
            <p className="text-sm text-slate-500">
              고객에게 보이는 {matchName(category)} 이름입니다.
            </p>
          </div>
          <Form.Item
            name="menuTitle"
            rules={[
              {
                required: true,
                message: `${matchName(category)} 이름을 입력해주세요.`,
              },
            ]}
            className="w-3/4"
          >
            <Input
              size="large"
              placeholder={`${matchName(category)} 이름을 입력해주세요 예) ${category === CategoryType.STAY ? "트윈룸" : "마라탕"}`}
            />
          </Form.Item>
          <div className="py-2 flex flex-col gap-1">
            <h3 className="text-slate-700 text-lg font-semibold">
              {matchName(category)} 가격
            </h3>
            <p className="text-sm text-slate-500">
              고객에게 보이는 {matchName(category)} 가격입니다.
            </p>
          </div>
          <Form.Item
            name="menuPrice"
            rules={[
              {
                required: true,
                message: `${matchName(category)} 가격을 입력해주세요.`,
              },
            ]}
            className="w-3/4"
          >
            <InputNumber
              size="large"
              placeholder={`${matchName(category)} 가격을 입력해주세요 예) 100000`}
              suffix="원"
              onChange={value => {
                if (typeof value === "number") {
                  setValue(value);
                }
              }}
              formatter={value => {
                if (typeof value === "string") {
                  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                return "";
              }}
              parser={value => value?.replace(/,/g, "") as unknown as number}
              className="w-full"
            />
          </Form.Item>
          <Form.Item className="flex justify-end gap-2">
            <Button
              type="default"
              size="large"
              htmlType="button"
              className="mr-5 text-slate-500 text-lg"
              onClick={() => form.resetFields()}
            >
              <RiArrowGoBackFill />
              초기화
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="text-lg"
            >
              등록하기
            </Button>
            <Button
              type="default"
              size="large"
              htmlType="button"
              className="mr-5 text-slate-500 text-lg"
              onClick={() => navigateToNext()}
            >
              그냥 넘어가기
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </section>
  );
};

export default MenuForm;
