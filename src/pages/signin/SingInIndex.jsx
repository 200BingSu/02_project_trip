import logo from "../../assets/logo_1.png";
import { Button, Checkbox, Form, Input } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { getCookie, removeCookie, setCookie } from "../../utils/cookie";
import { userAtom } from "../../atoms/userAtom";
import { USER } from "../../constants/api";
import { useEffect, useState } from "react";
import moment from "moment";

//카카오 로그인 url
const snsUrl = "http://localhost:8080/oauth2/authorization";
const handleKakaoLogin = () => {
  window.location.href = `${snsUrl}`;
};
const SingInIndex = () => {
  //쿠키
  const savedUserLogin = getCookie("user");
  const nowEmail = savedUserLogin?.email;
  const [form] = Form.useForm();
  // recoil
  const [loginInfo, setLoginInfo] = useRecoilState(userAtom);
  useEffect(() => {
    // console.log("recoil", loginInfo);
  }, [loginInfo]);

  // useNavigate
  const navigate = useNavigate();
  const handleNavigateHome = () => {
    navigate(`/`);
  };
  // useState
  const [loginType, setLoginType] = useState("personal");
  const [isSaveLogin, setIsSaveLogin] = useState(
    savedUserLogin ? savedUserLogin.isSaveLogin : false,
  );
  const [isSaveEmail, setIsSaveEmail] = useState(
    savedUserLogin ? savedUserLogin.isSaveEmail : false,
  );

  // 로그인 함수

  const postSignInUser = async data => {
    try {
      const res = await axios.post(`${USER.signInUser}`, data);
      // console.log("로그인 시도:", res.data);
      if (res.data.data === 200) {
        // console.log("현재 시각:", moment().format("H:mm:ss"));
        setCookie(`accessToken`, res.data.accessToken);
        setCookie("user", {
          userId: res.data.userId,
          email: data.email,
          isSaveLogin: isSaveLogin,
          isSaveEmail: isSaveEmail,
        });
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
    // console.log("로그인 시도 데이터:", values);
    postSignInUser(values);
  };

  // 로그인 상태 저장
  const handleSaveLogin = () => {};
  // 아이디 저장
  const handleSaveEmail = () => {};

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
      {/* 로고 */}
      <div
        className="w-full 
                    flex items-center justify-center"
      >
        <div className="w-[44.2vw] h-auto">
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
          className={`text-base h-[60px] pt-[17px] pb-[16px]
                     ${loginType === "personal" ? "text-primary" : "text-slate-400"}
                     ${loginType === "personal" ? "border-b-[2px] border-primary" : "border-b-1 border-slate-200"}`}
          onClick={() => setLoginType("personal")}
        >
          개인회원
        </button>
        <button
          type="button"
          className={`text-base h-[60px] pt-[17px] pb-[16px]
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
            labelCol={{ span: 24 }}
            initialValue={nowEmail || ""}
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
            <Checkbox
              checked={isSaveLogin}
              onChange={() => setIsSaveLogin(!isSaveLogin)}
            >
              로그인 유지
            </Checkbox>
            <Checkbox
              checked={isSaveEmail}
              onChange={() => setIsSaveEmail(!isSaveEmail)}
            >
              아이디 저장
            </Checkbox>
          </div>
          {/* 제출 버튼 */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="h-[60px] font-semibold text-[16px]"
            >
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
            <button
              type="button"
              className="text-slate-500"
              onClick={() => navigate(`/user/findpw`)}
            >
              비밀번호 찾기
            </button>
          </div>
          <Link to="/signup/index" className="text-slate-500 underline">
            회원가입
          </Link>
        </div>
      </div>
      {/* 카카오 로그인 */}
      <div className="w-full">
        <button
          type="button"
          onClick={handleKakaoLogin}
          className="w-full h-[60px]  bg-[#FEE500] hover:bg-[#FEE500]/80 rounded-md
         
          flex items-center justify-center gap-[10px]"
        >
          <img src="/images/kakaoIcon.svg" alt="kakao" />
          <p className="w-[265px] text-center  font-semibold text-[14px] text-[#191600] ">
            카카오 로그인
          </p>
        </button>
      </div>
    </div>
  );
};
export default SingInIndex;
