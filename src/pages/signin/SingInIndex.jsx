import logo from "../../assets/logo_1.png";
import { Button, Checkbox, Form, Input } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { removeCookie, setCookie } from "../../utils/cookie";
import { userAtom } from "../../atoms/userAtom";
import { USER } from "../../constants/api";
import { useEffect, useState } from "react";
import moment from "moment";

const SingInIndex = () => {
  const [form] = Form.useForm();
  // recoil
  const [loginInfo, setLoginInfo] = useRecoilState(userAtom);
  useEffect(() => {
    console.log("recoil", loginInfo);
  }, [loginInfo]);

  // useNavigate
  const navigate = useNavigate();
  const handleNavigateHome = () => {
    navigate(`/`);
  };
  // useState
  const [loginType, setLoginType] = useState("personal");
  // 로그인 함수
  const postSignInUser = async data => {
    try {
      const res = await axios.post(`${USER.signInUser}`, data);
      console.log("로그인 시도:", res.data);
      if (res.data.data === 200) {
        console.log("현재 시각:", moment().format("H:mm:ss"));
        setCookie(`accessToken`, res.data.accessToken);
        setLoginInfo({
          userId: res.data.userId,
          accessToken: res.data.accessToken,
        });
        handleNavigateHome();
      }
    } catch (error) {
      console.log("로그인 에러:", error);
      removeCookie(`accessToken`);
    }
  };

  // 폼 제출 함수
  const onFinish = values => {
    console.log("로그인 시도 데이터:", values);
    postSignInUser(values);
  };

  return (
    <div
      className="w-full h-screen px-[122px] py-[225px] 
                    flex flex-col items-center justify-center"
    >
      {/* 로고 */}
      <div
        className="w-full 
                    flex items-center justify-center"
      >
        <div className="w-[330px] h-[50px] mb-[20px]">
          <img
            src={logo}
            alt="main_logo"
            className="cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          />
        </div>
      </div>
      {/* 로그인 타입 */}
      <div
        className="w-full h-[30px] 
                    flex items-center justify-center 
                    gap-[30px]"
      >
        <button
          type="button"
          className={`text-2xl h-[60px] pt-[17px] pb-[16px]
                     ${loginType === "personal" ? "text-primary" : "text-slate-400"}
                     ${loginType === "personal" ? "border-b-[2px] border-primary" : "border-b-1 border-slate-200"}`}
          onClick={() => setLoginType("personal")}
        >
          개인회원
        </button>
        <button
          type="button"
          className={`text-2xl h-[60px] pt-[17px] pb-[16px]
                     ${loginType === "business" ? "text-primary" : "text-slate-400"}
                     ${loginType === "business" ? "border-b-[2px] border-primary" : "border-b-1 border-slate-200"}`}
          onClick={() => setLoginType("business")}
        >
          기업회원
        </button>
      </div>
      {/* 로그인 폼 */}
      <div className="w-full">
        <Form
          form={form}
          name="register"
          onFinish={values => onFinish(values)}
          style={{ maxWidth: 600 }}
          scrollToFirstError
        >
          {/* 이메일 */}
          <Form.Item
            name="email"
            label="이메일"
            labelCol={{ span: 24 }} // Label의 그리드 크기
            // rules={[{ required: true, message: "이메일을 입력해주세요." }]}
          >
            <Input
              placeholder="이메일을 입력하세요"
              style={{ height: "60px" }}
            />
          </Form.Item>
          <Form.Item
            name="pw"
            label="비밀번호"
            labelCol={{ span: 24 }} // Label의 그리드 크기
            // rules={[{ required: true, message: "비밀번호를 입력해주세요." }]}
          >
            <Input.Password
              placeholder="비밀번호를 입력하세요"
              style={{ height: "60px" }}
            />
          </Form.Item>
          {/* 로그인 유지, 아이디 저장 */}
          <div
            className="w-full mb-[40px] 
                          flex items-center justify-start"
          >
            <Checkbox disabled>로그인 유지</Checkbox>
            <Checkbox disabled>아이디 저장</Checkbox>
          </div>
          {/* 제출 버튼 */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block className="h-[60px]">
              다음
            </Button>
          </Form.Item>
        </Form>
        {/* 아이디 찾기, 비밀번호 찾기, 회원가입 */}
        <div
          className="w-full 
                        flex items-center justify-between 
                        gap-[20px]"
        >
          <div
            className="flex items-center justify-center 
                          gap-[20px] 
                          text-slate-300"
          >
            <button type="button" className="text-slate-500">
              아이디 찾기
            </button>
            |
            <button type="button" className="text-slate-500">
              비밀번호 찾기
            </button>
          </div>
          <Link to="/signup/index" className="text-slate-500 underline">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SingInIndex;
