import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Spin,
  Upload,
  UploadFile,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import { ProfilePic } from "../../../constants/pic";
import { getCookie } from "../../../utils/cookie";
import dayjs from "dayjs";
import { BiSolidCamera } from "react-icons/bi";

interface Pdata {
  name: string;
  tell: string;
  birth: string;
}

const EditUser = () => {
  //쿠키
  const userInfo = getCookie("user");
  const userId = userInfo.userId;
  const accessToken = getCookie("accessToken");
  //router
  const navigate = useNavigate();

  //useState
  const [isLoading, setIsLoading] = useState(false);
  const [profilePic, setProfilePic] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [form] = Form.useForm();
  // api 유저 정보 조회
  const getUserInfo = async () => {
    const url = "/api/user/userInfo";
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const resultData = res.data;
      if (resultData) {
        form.setFieldValue("name", resultData.data.name);
        form.setFieldValue("tell", formatPhoneNumber(resultData.data.tell));
        if (resultData.data.birth) {
          form.setFieldValue("birth", dayjs(resultData.data.birth));
        }
        setProfilePic(resultData.data.profilePic);
      }
      console.log("유저 정보", resultData);
    } catch (error) {
      console.log("유저 정보 조회", error);
    }
  };
  // api 유저 정보 수정
  const updateUser = async (payload: any) => {
    const url = "/api/user";
    setIsLoading(true);
    try {
      const res = await axios.patch(url, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const resultData = res.data;
      if (resultData) {
        message.success("프로필이 수정되었습니다.");
        getUserInfo();
        navigate(-1);
      }
    } catch (error) {
      console.log("유저 정보 수정", error);
    } finally {
      setIsLoading(false);
    }
  };
  const onFinish = (values: any) => {
    const pData: Pdata = {
      name: values.name,
      tell: values.tell,
      birth: values.birth,
    };
    const formData = new FormData();
    formData.append(
      "p",
      new Blob([JSON.stringify(pData)], {
        type: "application/json",
      }),
    );
    if (fileList[0]?.originFileObj) {
      formData.append("profilePic", fileList[0].originFileObj);
    }
    updateUser(formData);
  };
  const onChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
    if (newFileList[0]?.originFileObj) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(newFileList[0].originFileObj);
    }
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
  const formatPhoneNumber = (value: string) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneLength = phoneNumber.length;

    if (phoneLength <= 3) {
      return phoneNumber;
    } else if (phoneLength <= 7) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    } else {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
    }
  };
  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <div>
      <TitleHeaderTs
        title="프로필 설정"
        icon="back"
        onClick={() => navigate(-1)}
      />
      <section className="flex flex-col gap-5 mt-5 py-3 px-4">
        {/* 유저 이미지 */}
        <Spin spinning={isLoading}>
          <Form
            form={form}
            onFinish={onFinish}
            className="flex flex-col gap-2 relative"
          >
            <div className="flex justify-center">
              <div className="mx-auto w-32 aspect-square relative">
                <img
                  src={previewUrl || `${ProfilePic}/${userId}/${profilePic}`}
                  alt="User-Profile"
                  className="w-full h-full object-cover rounded-full"
                />
                <Form.Item
                  name="profilePic"
                  rules={[
                    { required: true, message: "프로필 이미지를 입력해주세요" },
                  ]}
                  className="absolute -bottom-7 -right-0"
                >
                  <Upload
                    name="profilePic"
                    showUploadList={false}
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                    beforeUpload={() => false}
                    accept="image/*"
                    maxCount={1}
                  >
                    <div className="flex bg-primary w-8 h-8 justify-center items-center rounded-full cursor-pointer border-2 border-white box-content">
                      <BiSolidCamera className="text-lg text-white" />
                    </div>
                  </Upload>
                </Form.Item>
              </div>
            </div>

            <h3 className="text-slate-700 text-xs font-semibold pb-1">
              닉네임
            </h3>
            <Form.Item
              name="name"
              rules={[{ required: true, message: "닉네임을 입력해주세요" }, {}]}
            >
              <Input
                placeholder="닉네임을 입력해주세요"
                size="large"
                className="h-12"
              />
            </Form.Item>
            <h3 className="text-slate-700 text-xs font-semibold pb-1">
              전화번호
            </h3>
            <Form.Item
              name="tell"
              rules={[
                {
                  required: false,
                  validator: async (_, value) => {
                    if (!value) return Promise.resolve();
                    const phoneRegex =
                      /^01([0|1|6|7|8|9])-([0-9]{3,4})-([0-9]{4})$/;
                    if (!phoneRegex.test(value)) {
                      return Promise.reject(
                        "올바른 휴대폰 번호 형식이 아닙니다. (예: 010-1234-5678)",
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                placeholder="전화번호를 입력해주세요"
                size="large"
                className="h-12"
                maxLength={13}
                onChange={e => {
                  const value = e.target.value.replace(/[^\d]/g, "");
                  const formattedNumber = formatPhoneNumber(value);
                  form.setFieldsValue({ tell: formattedNumber });
                }}
              />
            </Form.Item>
            <h3 className="text-slate-700 text-xs font-semibold pb-1">
              생년월일
            </h3>
            <Form.Item
              name="birth"
              rules={[{ required: true, message: "생년월일을 입력해주세요" }]}
            >
              <DatePicker
                placeholder="생년월일을 입력해주세요"
                size="large"
                className="h-12 w-full"
              />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                size="large"
                className="h-12 w-full text-lg font-semibold"
              >
                완료
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </section>
    </div>
  );
};

export default EditUser;
