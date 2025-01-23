import { useLocation, useNavigate } from "react-router-dom";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { Button, Form, Input } from "antd";
import { useState } from "react";
import Timer from "../../components/signup/Timer";
import axios from "axios";
import { USER } from "../../constants/api";

const ConfirmEmail = () => {
  const [form] = Form.useForm();

  // useNavigate
  const navigate = useNavigate();
  const location = useLocation();
  const locationData = location.state;
  console.log("이메일 코드 확인 페이지:", locationData);
  const handleNavigateNext = data => {
    navigate(`/signup/complete`, { state: data });
  };

  // postSignup
  const postSignUpUser = async data => {
    console.log("보낼 데이터:", data);
    try {
      const res = await axios.post(`${USER.signUpUser}`, data);
      console.log("회원가입 시도:", res.data);
      handleNavigateNext(locationData);
    } catch (error) {
      console.log("회원가입 시도:", error);
    }
  };
  // checkMail
  const postCheckMail = async data => {
    try {
      const res = await axios.post(`${USER.checkMail}`, data);
      console.log("이메일 링크 체크:", res.data);
      if (res.data.code === "200 성공") {
        postSignUpUser(locationData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 제출 버튼
  const onFinish = values => {
    const formData = values;
    const sendData = {
      ...formData,
      email: locationData.p.email ? locationData.p.email : "없음",
    };
    console.log(sendData);
    postCheckMail(sendData);
  };

  return (
    <>
      <TitleHeader icon="back" title="회원가입" />
      {/* 타이틀 */}
      <div>이메일 인증 확인</div>
      {/* 안내문 */}
      <div>
        <p>{locationData ? locationData.email : "이메일이 없습니다."}</p>
        <p>
          본인인증 이메일이 발송되었습니다. 확인 후 회원가입을 완료해주시기
          바랍니다.
        </p>
      </div>
      {/* 인증 코드 작성 */}
      <div className="items-center h-full" style={{ position: "relative" }}>
        <Form
          form={form}
          name="register"
          onFinish={values => onFinish(values)}
          style={{ maxWidth: 600 }}
          scrollToFirstError
        >
          {/* 이메일 인증 코드 입력 */}
          <Form.Item
            name="code"
            label="인증코드"
            rules={[
              {
                message: "이메일 인증 코드를 입력해주세요",
                whitespace: true,
              },
            ]}
            labelCol={{ span: 24 }} // Label의 그리드 크기
          >
            <Input
              placeholder="인증 코드를 입력해주세요"
              style={{ height: "60px" }}
            />
          </Form.Item>
          {/* <Timer /> */}
          <p>
            메일을 받지 못했다면 인증 코드 재 전송을 요청하거나 스팸 메일함을
            확인해보세요.
          </p>
          <p>
            이메일이 오지 않았나요? <span>이메일 재발송</span>
          </p>
          {/* 제출 버튼 */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block className="h-[60px]">
              다음
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
export default ConfirmEmail;
