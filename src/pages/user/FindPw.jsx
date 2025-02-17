import { Button, Form, Input, Spin } from "antd";
import jwtAxios from "../../apis/jwt";
import { memo, useCallback, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TitleHeader from "../../components/layout/header/TitleHeader";

const FindPw = () => {
  const [form] = Form.useForm();
  //useNavigate
  const navigate = useNavigate();
  //useState
  const [openEmailLoading, setOpenEmailLoading] = useState(false);

  // 임시 비밀번호 이메일 발송
  const postResetEmail = useCallback(async data => {
    const sendData = {
      email: data.email,
    };
    try {
      const res = await axios.post(`/api/user/password`, sendData);
      console.log(res.data);
      const resultData = res.data;
      if (resultData) {
        setOpenEmailLoading(false);
        navigate("/user/signin");
      }
    } catch (error) {
      console.log("임시 비번 이메일", error);
      setOpenEmailLoading(false);
    }
  }, []);

  // 제출 버튼
  const onFinish = values => {
    setOpenEmailLoading(true);
    console.log(values);
    postResetEmail(values);
  };

  return (
    <div>
      <TitleHeader
        title="임시 비밀번호 발송"
        onClick={() => {
          navigate("/user/signin");
        }}
        icon="back"
      />
      <div
        className="mt-[100px] flex flex-col justify-center items-center w-full
      px-8"
      >
        {/* 타이틀 */}
        <h2 className="text-[30px] text-slate-700 font-bold">
          이메일 인증 확인
        </h2>
        <Spin spinning={openEmailLoading} tip="이메일을 발송중입니다.">
          <Form
            form={form}
            onFinish={onFinish}
            requiredMark={false}
            className="flex flex-col items-center justify-center"
          >
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
    </div>
  );
};

export default memo(FindPw);
