import { useLocation, useNavigate } from "react-router-dom";
import TitleHeader from "../../../components/layout/header/TitleHeader";
import { Button, Form, Input } from "antd";
import { useCallback, useEffect, useState } from "react";
import Timer from "../../../components/signup/Timer";
import axios from "axios";
import { USER } from "../../../constants/api";

const ConfirmEmail = () => {
  const [form] = Form.useForm();
  //useState
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState("");
  const [locationData, setLocationData] = useState(null);
  const [validateStatus, setValidateStatus] = useState(null);
  // useNavigate
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state;
  console.log("로케이션 데이터", locationState);
  const handleNavigateNext = data => {
    navigate(`/signup/complete`, { state: data });
  };

  useEffect(() => {
    setFormData(locationState);
  }, []);
  //postEmail
  const postEmail = useCallback(async () => {
    const sendData = {
      email: locationState.email,
    };
    console.log("이메일 발송 데이터:", sendData);
    try {
      const res = await axios.get(`${USER.sendMail}${data.email}`, sendData);
      console.log("이메일 발송 결과:", res.data);
    } catch (error) {
      console.log(error);
    }
  }, []);
  // postSignup
  const postSignUpUser = async () => {
    const postData = new FormData();
    postData.append(
      "p",
      new Blob([JSON.stringify(formData)], { type: "application/json" }),
    );
    if (file) {
      postData.append("profilePic", file);
    }
    console.log("보낼 데이터:", [...postData]);
    try {
      const res = await axios.post(`${USER.signUpUser}`, postData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("회원가입 시도:", res.data);
      handleNavigateNext(locationState);
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
        setValidateStatus("success");
        postSignUpUser(data);
      } else {
        setValidateStatus("error");
      }
    } catch (error) {
      console.log(error);
      setValidateStatus("error");
    }
  };

  // 제출 버튼
  const onFinish = values => {
    const formData = values;
    const emailCheckData = {
      ...formData,
      email: locationState.email ? locationState.email : "없음",
    };
    console.log(emailCheckData);
    postCheckMail(emailCheckData);
  };

  return (
    <>
      <TitleHeader icon="back" title="회원가입" />
      <div className="mt-[100px] flex flex-col items-center justify-center">
        <div>
          {/* 타이틀 */}
          <h2 className="text-[30px] text-slate-700 font-bold">
            이메일 인증 확인
          </h2>
          {/* 안내문 */}
          <div>
            <p className="text-[24px] text-primary font-bold">
              {locationState ? locationState.email : "이메일이 없습니다."}
            </p>
            <p className="text-[18px] text-slate-600 font-medium">
              본인인증 이메일이 발송되었습니다. 확인 후 회원가입을 완료해주시기
              바랍니다.
            </p>
          </div>
          {/* 인증 코드 작성 */}
          <div className="items-center h-full">
            <Form
              form={form}
              name="register"
              onFinish={values => onFinish(values)}
              style={{ maxWidth: 600, position: "relative" }}
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
                hasFeedback
                validateStatus={validateStatus}
                help={
                  validateStatus === "error"
                    ? "틀린 인증코드입니다."
                    : validateStatus === "success"
                      ? "인증코드가 일치합니다."
                      : null
                }
              >
                <Input
                  placeholder="인증 코드를 입력해주세요"
                  style={{ height: "60px" }}
                />
              </Form.Item>
              <Timer />
              <p>
                메일을 받지 못했다면 인증 코드 재 전송을 요청하거나 스팸
                메일함을 확인해보세요.
              </p>
              <p>
                이메일이 오지 않았나요?{" "}
                <button type="button" className="text-slate-600 underline">
                  이메일 재발송
                </button>
              </p>
              {/* 제출 버튼 */}
              <Form.Item className="mt-[20px] w-full">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className="h-[60px] w-full"
                >
                  다음
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};
export default ConfirmEmail;
