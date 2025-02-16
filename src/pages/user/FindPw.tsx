import { Button, Form, Input, Spin } from "antd";
import jwtAxios from "../../apis/jwt";
import { memo, useCallback, useState } from "react";

interface IformData {
  email: string;
}

const FindPw = () => {
  const [form] = Form.useForm();
  //useState
  const [openEmailLoading, setOpenEmailLoading] = useState<boolean>(false);

  // 임시 비밀번호 이메일 발송
  const postResetEmail = useCallback(async (data: IformData) => {
    const sendData = {
      email: data.email,
    };
    try {
      const res = await jwtAxios.post(`/api/user/reset-password`, sendData);
      console.log(res.data);
      const resultData = res.data;
      if (resultData.status === 200) {
        setOpenEmailLoading(false);
      }
    } catch (error) {
      console.log("임시 비번 이메일", error);
      setOpenEmailLoading(false);
    }
  }, []);

  // 제출 버튼
  const onFinish = (values: IformData) => {
    setOpenEmailLoading(true);
    console.log(values);
    postResetEmail(values);
  };

  return (
    <div>
      <h1>임시 비밀번호 발송</h1>
      <Spin spinning={openEmailLoading}>
        <Form form={form} onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="email"
            label="이메일"
            rules={[
              {
                type: "email",
                message: "이메일 형식을 입력해주세요.",
              },
              { required: true, message: "이메일을 입력해주세요." },
            ]}
          >
            <Input placeholder="이메일을 입력해주세요." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              임시 비밀번호 발송
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default memo(FindPw);
